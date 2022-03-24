using System.Collections.Generic;
using KnowledgeCenter.Match.Contracts;

namespace KnowledgeCenter.Match.Providers._Interfaces
{
    public interface IMatchingScorePerSkillProvider
    {
        List<MatchingScorePerSkill> GetAllMatchingScoresPerSkill(int matchingId);
        MatchingScorePerSkill GetMatchingScorePerSkill(int matchingScorePerSkillId);
    }
}