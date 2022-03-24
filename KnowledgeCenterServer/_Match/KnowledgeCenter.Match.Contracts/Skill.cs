using System.ComponentModel.DataAnnotations;

namespace KnowledgeCenter.Match.Contracts
{
    public class Skill
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        public int ServiceLineId { get; set; }
        public ServiceLine ServiceLine { get; set; }
    }
}