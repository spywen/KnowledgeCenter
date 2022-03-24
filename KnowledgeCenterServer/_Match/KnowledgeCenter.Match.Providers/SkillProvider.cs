using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.Match.Providers._Interfaces;
using Microsoft.EntityFrameworkCore;
using Entities = KnowledgeCenter.DataConnector.Entities;
using Skill = KnowledgeCenter.Match.Contracts.Skill;

namespace KnowledgeCenter.Match.Providers
{
    public class SkillProvider : ISkillProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IMapper _mapper;

        public SkillProvider(
            KnowledgeCenterContext knowledgeCenterContext,
            IMapper mapper)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _mapper = mapper;
        }

        public List<Skill> GetAllSkills()
        {
            return _knowledgeCenterContext.Skills
                .Include(x => x.ServiceLine)
                .Select(x => _mapper.Map<Skill>(x))
                .ToList();
        }

        public Skill GetSkill(int skillId)
        {
            if (!_knowledgeCenterContext.Skills.Any(x => x.Id == skillId))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            } 

            return _mapper.Map<Skill>(
                _knowledgeCenterContext.Skills
                    .Include(x => x.ServiceLine)
                    .Single(x => x.Id == skillId)
            );
        }

        public Skill CreateSkill(Skill skillFacade)
        {
            if (_knowledgeCenterContext.Skills
                .Any(x => string.Equals(x.Name, skillFacade.Name, StringComparison.CurrentCultureIgnoreCase)))
            {
                throw new HandledException(ErrorCode.SKILL_ALREADYEXISTS);
            }
            
            if (skillFacade.ServiceLineId != 0 && !_knowledgeCenterContext.ServiceLines
                    .Any(x => x.Id == skillFacade.ServiceLineId))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            var skill = new Entities.Match.Skill
            {
                Name = skillFacade.Name,
                ServiceLineId = skillFacade.ServiceLineId != 0 ? skillFacade.ServiceLineId : (int?) null
            };

            _knowledgeCenterContext.Skills.Add(skill);
            _knowledgeCenterContext.SaveChanges();

            return _mapper.Map<Skill>(skill);
        }

        public Skill UpdateSkill(int skillId, Skill skillFacade)
        {
            var foundSkill = _knowledgeCenterContext.Skills.SingleOrDefault(x => x.Id == skillId);
            if (foundSkill == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            if (_knowledgeCenterContext.Skills
                .Any(x => x.Name == skillFacade.Name))
            {
                throw new HandledException(ErrorCode.SKILL_ALREADYEXISTS);
            }

            foundSkill.Name = skillFacade.Name;
            
            if (skillFacade.ServiceLineId != 0 && !_knowledgeCenterContext.ServiceLines
                    .Any(x => x.Id == skillFacade.ServiceLineId))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            foundSkill.ServiceLineId = skillFacade.ServiceLineId != 0 ? skillFacade.ServiceLineId : (int?) null;

            _knowledgeCenterContext.Skills.Update(foundSkill);
            _knowledgeCenterContext.SaveChanges();
            return _mapper.Map<Skill>(foundSkill);
        }

        public void DeleteSkill(int skillId)
        {
            var foundSkill = _knowledgeCenterContext.Skills.SingleOrDefault(x => x.Id == skillId);
            if (foundSkill == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }
            
            if (_knowledgeCenterContext.CollaboratorSkills.Any(x => x.SkillId == skillId))
            {
                throw new HandledException(ErrorCode.SKILL_LINKEDTOCOLLABORATOR);
            }

            _knowledgeCenterContext.Skills.Remove(foundSkill);
            _knowledgeCenterContext.SaveChanges();
        }
    }
}