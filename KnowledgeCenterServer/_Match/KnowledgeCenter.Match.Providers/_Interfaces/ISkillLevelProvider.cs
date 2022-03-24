using System.Collections.Generic;
using KnowledgeCenter.Match.Contracts;

namespace KnowledgeCenter.Match.Providers._Interfaces
{
    public interface ISkillLevelProvider
    {
        List<SkillLevel> GetAllSkillLevels();
 
        SkillLevel GetSkillLevel(int skillLevelId);
        SkillLevel CreateSkillLevel(SkillLevel skillLevel);
        SkillLevel UpdateSkillLevel(int skillLevelId, SkillLevel skillLevel);
        void DeleteSkillLevel(int skillLevelId);
    }
}