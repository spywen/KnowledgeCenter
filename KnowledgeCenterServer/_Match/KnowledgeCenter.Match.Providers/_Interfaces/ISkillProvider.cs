using System.Collections.Generic;
using KnowledgeCenter.Match.Contracts;

namespace KnowledgeCenter.Match.Providers._Interfaces
 {
     public interface ISkillProvider
     {
         List<Skill> GetAllSkills();
         Skill GetSkill(int skillId);
         Skill CreateSkill(Skill skill);
         Skill UpdateSkill(int skillId, Skill skill);
         void DeleteSkill(int skillId);
     }
 }