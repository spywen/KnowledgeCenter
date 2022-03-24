using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities.Match
{
    [Table("Match.Matching")]
    public class Matching
    {
        public int Id { get; set; }
        public int CustomerOfferId { get; set; }
        public CustomerOffer CustomerOffer { get; set; }
        public int CollaboratorId { get; set; }
        public Collaborator Collaborator { get; set; }
        public DateTime CreationDate { get; set; }
        public double Score { get; set; }
        public virtual ICollection<MatchingScorePerSkill> MatchingScorePerSkill { get; set; }
    }
}