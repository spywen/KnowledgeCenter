using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities.Match
{
    [Table("Match.Skill")]
    public class Skill
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? ServiceLineId { get; set; }
        public ServiceLine ServiceLine { get; set; }
    }
}