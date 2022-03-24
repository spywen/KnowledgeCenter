using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.Match.Contracts;
using KnowledgeCenter.Match.Providers._Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KnowledgeCenter.Match.Providers
{
    public class MatchingScorePerSkillProvider : IMatchingScorePerSkillProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IMapper _mapper;

        public MatchingScorePerSkillProvider(
            KnowledgeCenterContext knowledgeCenterContext,
            IMapper mapper)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _mapper = mapper;
        }
        
        public List<MatchingScorePerSkill> GetAllMatchingScoresPerSkill(int matchingId)
        {
            if (!_knowledgeCenterContext.MatchingScoresPerSkill.Any(x => x.MatchingId == matchingId))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }
            return _knowledgeCenterContext.MatchingScoresPerSkill
                .Select(x => _mapper.Map<MatchingScorePerSkill>(x))
                .Where(x => x.MatchingId == matchingId)
                .ToList();
        }

        public MatchingScorePerSkill GetMatchingScorePerSkill(int matchingScorePerSkillId)
        {
            if (!_knowledgeCenterContext.MatchingScoresPerSkill.Any(x => x.Id == matchingScorePerSkillId))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }
            return _knowledgeCenterContext.MatchingScoresPerSkill
                .Select(x => _mapper.Map<MatchingScorePerSkill>(x))
                .Single(x => x.Id == matchingScorePerSkillId);
        }
    }
}