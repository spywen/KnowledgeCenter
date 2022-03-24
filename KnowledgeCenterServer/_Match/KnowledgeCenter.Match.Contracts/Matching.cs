using System;
using System.Collections.Generic;

namespace KnowledgeCenter.Match.Contracts
{
    public class Matching
    {
        public int Id { get; set; }
        public int CollaboratorId { get; set; }
        public Collaborator Collaborator { get; set; }
        public DateTime CreationDate { get; set; }
        public double Score { get; set; }
        public List<MatchingScorePerSkill> MatchingScorePerSkills { get; set; }
    }
}