using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities.Match
{
    [Table("Match.Collaborator")]
    public class Collaborator
    {
        public int Id { get; set; }
        public int GGID { get; set; }
        public ICollection<CollaboratorSkill> CollaboratorSkills { get; set; }
    }
}