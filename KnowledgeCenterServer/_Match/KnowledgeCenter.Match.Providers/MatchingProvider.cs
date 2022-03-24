using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using KnowledgeCenter.Common;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.Match.Contracts;
using KnowledgeCenter.Match.Providers._Interfaces;
using Microsoft.EntityFrameworkCore;
using Entities = KnowledgeCenter.DataConnector.Entities.Match;

namespace KnowledgeCenter.Match.Providers
{
    public class MatchingProvider : IMatchingProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IMapper _mapper;

        public MatchingProvider(
            KnowledgeCenterContext knowledgeCenterContext,
            IMapper mapper)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _mapper = mapper;
        }

        public BasePaginationResponse<List<Matching>> GetFilteredMatching(BasePaginationRequest<MatchingFilter> query)
        {
            var filters = query.Filters;
            var matchingQuery = _knowledgeCenterContext.Matching
                .Where(x => filters == null ||
                            (filters.CustomerOfferId == 0 || x.CustomerOfferId == filters.CustomerOfferId)
                )
                .Select(x => new Matching
                {
                    Id = x.Id,
                    CollaboratorId = x.CollaboratorId,
                    CreationDate = x.CreationDate,
                    Score = x.Score,
                    MatchingScorePerSkills = _mapper.Map<List<MatchingScorePerSkill>>(_knowledgeCenterContext.MatchingScoresPerSkill.Where(v => v.MatchingId == x.Id))
                })
                .ToList();

            matchingQuery
                .Select(x =>
                {
                    x.Collaborator = GetMatchingCollaborator(x.CollaboratorId);
                    return x;
                }).ToList();

            var matchingResults = matchingQuery
                .Skip(query.Size * (query.Page - 1))
                .Take(query.Size)
                .ToList()
                .OrderByDescending(x => x.Score);
            var totalItems = matchingQuery.Count;

            return new BasePaginationResponse<List<Matching>>(_mapper.Map<List<Matching>>(matchingResults), query, totalItems);
        }

        public Matching GetMatching(int matchingId)
        {
            if (!_knowledgeCenterContext.Matching.Any(x => x.Id == matchingId))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

             return _mapper.Map<Matching>(_knowledgeCenterContext.Matching.Single(x => x.Id == matchingId));
        }

        public List<Matching> GenerateMatching(int customerOfferId)
        {
            var customerOffer = _knowledgeCenterContext.CustomerOffers
                .Include(x => x.CustomerOfferSkills)
                .ThenInclude(x => x.Skill)
                .Include(x => x.CustomerOfferSkills)
                .ThenInclude(x => x.SkillLevel)
                .SingleOrDefault(x => x.Id == customerOfferId);

            if (customerOffer == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }
            
            if (_knowledgeCenterContext.Matching.Any(x => x.CustomerOfferId == customerOfferId))
            {
                DeleteMatching(customerOfferId);
            }

            var (matchingResults, scorePerSkillResults) = MatchAlgorithm(_mapper.Map<CustomerOffer>(customerOffer));

            var matching = new List<Entities.Matching>();
            var matchingScoresPerSkill = new List<Entities.MatchingScorePerSkill>();
            var now = DateTime.Now;

            foreach (var (collaboratorId, score) in matchingResults)
            {
                matching.Add(new Entities.Matching
                {
                    CustomerOfferId = customerOffer.Id,
                    CollaboratorId = collaboratorId,
                    CreationDate = now,
                    Score = score
                });
            }

            _knowledgeCenterContext.Matching.AddRange(matching);
            _knowledgeCenterContext.SaveChanges();

            foreach (var scorePerSkillResult in scorePerSkillResults)
            {
                matchingScoresPerSkill.Add(new Entities.MatchingScorePerSkill
                {
                    MatchingId = matching
                        .Where(x => x.CollaboratorId == scorePerSkillResult.CollaboratorId)
                        .Select(x => x.Id)
                        .Single(),
                    SkillLevelId = scorePerSkillResult.SkillLevelId,
                    CustomerOfferSkillId = scorePerSkillResult.CustomerOfferSkillId,
                    Score = scorePerSkillResult.Score
                });
            }

            _knowledgeCenterContext.MatchingScoresPerSkill.AddRange(matchingScoresPerSkill);
            _knowledgeCenterContext.SaveChanges();

            return GetFilteredMatching(new BasePaginationRequest<MatchingFilter>(new MatchingFilter
            {
                CustomerOfferId = customerOfferId
            })).Data;
        }

        public void DeleteMatching(int customerOfferId)
        {
            if (!_knowledgeCenterContext.CustomerOffers.Any(x => x.Id == customerOfferId))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            var matchingResults = _knowledgeCenterContext.Matching
                .Include(x => x.MatchingScorePerSkill)
                .Where(x => x.CustomerOfferId == customerOfferId)
                .ToList();

            foreach (var matching in matchingResults)
            {
                _knowledgeCenterContext.MatchingScoresPerSkill.RemoveRange(matching.MatchingScorePerSkill);
            }

            _knowledgeCenterContext.Matching.RemoveRange(matchingResults);
            _knowledgeCenterContext.SaveChanges();
        }

        private Tuple<Dictionary<int, double>, List<ScorePerSkillResult>> MatchAlgorithm(CustomerOffer customerOffer)
        {
            var skillIds = new List<int>();

            // STEP 1: Calculate weight according the priority per skill,
            // And calculate the reference global score.
            var weights = new Dictionary<int, double>();
            var nbSkills = customerOffer.CustomerOfferSkills.Count;
            double referenceGlobalScore = 0;

            foreach (var customerOfferSkill in customerOffer.CustomerOfferSkills)
            {
                var priority = nbSkills - customerOfferSkill.SkillPriority + 1;
                var weight = Math.Exp(priority / 2.0);
                weights.Add(customerOfferSkill.SkillId, weight);

                referenceGlobalScore += customerOfferSkill.SkillLevel.Order * weight;

                skillIds.Add(customerOfferSkill.SkillId);
            }

            // STEP 2: Get all collaboratorSkills, which have almost one expected skill.
            var collaboratorSkills = _knowledgeCenterContext.CollaboratorSkills
                .Include(x => x.Skill)
                .Include(x => x.SkillLevel)
                .Where(x => skillIds.Contains(x.SkillId))
                .ToList();

            // STEP 3: For each collaboratorSkill, calculate the score according the skill level.
            var scorePerSkillResults = collaboratorSkills
                .Select(x => new ScorePerSkillResult
                {
                    CollaboratorId = x.CollaboratorId,
                    SkillLevelId = x.SkillLevelId,
                    CustomerOfferSkillId = customerOffer.CustomerOfferSkills.Single(s => s.SkillId == x.SkillId).Id,
                    Score = x.SkillLevel.Order * weights[x.SkillId]
                }).ToList();

            // STEP 4: For each collaborator, calculate the global score, in percent.
            var matchingResults = scorePerSkillResults
                .GroupBy(x => x.CollaboratorId)
                .ToDictionary(x => x.Key, x => Math.Round(x.Sum(v => v.Score) / referenceGlobalScore * 100, 2));

            // STEP 5: For each skill, calculate the percent to meet expected criteria.
            // Maybe to change, according Didier ;)
            scorePerSkillResults
                .Select(x =>
                {
                    x.Score = Math.Round(x.Score * 100 / (referenceGlobalScore * matchingResults[x.CollaboratorId] / 100), 2);
                    return x;
                })
                .ToList();

            return Tuple.Create(matchingResults, scorePerSkillResults);
        }

        public Collaborator GetMatchingCollaborator(int collaboratorId)
        {
            var user = _knowledgeCenterContext.Users
                .Single(u => u.Id == collaboratorId);

            var collaborator = _knowledgeCenterContext.Collaborators
                .Single(c => c.Id == collaboratorId);

            return _mapper.Map<Collaborator>(user, opt => opt.Items[_MappingsParameters.Collaborators] = collaborator);
        }
    }
}