using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.Match.Contracts;
using KnowledgeCenter.Match.Providers._Interfaces;
using Entities = KnowledgeCenter.DataConnector.Entities;

namespace KnowledgeCenter.Match.Providers
{
    public class SkillLevelProvider : ISkillLevelProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IMapper _mapper;

        public SkillLevelProvider(KnowledgeCenterContext knowledgeCenterContext,
            IMapper mapper)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _mapper = mapper;
        }

        public List<SkillLevel> GetAllSkillLevels()
        {
            return _knowledgeCenterContext.SkillLevels
                .Select(x => _mapper.Map<SkillLevel>(x))
                .OrderBy(x => x.Order)
                .ToList();
        }

        public SkillLevel GetSkillLevel(int skillLevelId)
        {
            if (!_knowledgeCenterContext.SkillLevels.Any(x => x.Id == skillLevelId))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            } 

            return _mapper.Map<SkillLevel>(_knowledgeCenterContext.SkillLevels.Single(x => x.Id == skillLevelId)
            );
        }

        public SkillLevel CreateSkillLevel(SkillLevel skillLevelFacade)
        {
            if (_knowledgeCenterContext.SkillLevels
                .Any(x => string.Equals(x.Name, skillLevelFacade.Name, StringComparison.CurrentCultureIgnoreCase)))
            {
                throw new HandledException(ErrorCode.SKILLLEVEL_ALREADYEXISTS);
            }
            
            var skillLevel = new Entities.Match.SkillLevel
            {
                Name = skillLevelFacade.Name,
                Order = skillLevelFacade.Order
            };

            _knowledgeCenterContext.SkillLevels.Add(skillLevel);
            _knowledgeCenterContext.SaveChanges();

            return _mapper.Map<SkillLevel>(skillLevel);
        }

        public SkillLevel UpdateSkillLevel(int skillLevelId, SkillLevel skillLevelFacade)
        {
            var foundSkillLevel = _knowledgeCenterContext.SkillLevels.SingleOrDefault(x => x.Id == skillLevelId);
            if (foundSkillLevel == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            if (_knowledgeCenterContext.SkillLevels.Select(x => x.Name).ToList().Contains(skillLevelFacade.Name))
            {
                throw new HandledException(ErrorCode.SKILLLEVEL_ALREADYEXISTS);
            }

            foundSkillLevel.Name = skillLevelFacade.Name;
            foundSkillLevel.Order = skillLevelFacade.Order;

            _knowledgeCenterContext.SkillLevels.Update(foundSkillLevel);
            _knowledgeCenterContext.SaveChanges();
            return _mapper.Map<SkillLevel>(foundSkillLevel);
        }

        public void DeleteSkillLevel(int skillLevelId)
        {
            var foundSkillLevel = _knowledgeCenterContext.SkillLevels.SingleOrDefault(x => x.Id == skillLevelId);
            if (foundSkillLevel == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            _knowledgeCenterContext.SkillLevels.Remove(foundSkillLevel);
            _knowledgeCenterContext.SaveChanges();
        }
    }
}