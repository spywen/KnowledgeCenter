using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities.Match
{
    [Table("Match.SkillLevel")]
    public class SkillLevel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }
    }
}