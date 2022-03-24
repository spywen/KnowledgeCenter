using System.ComponentModel.DataAnnotations;

namespace KnowledgeCenter.Match.Contracts
{
    public class SkillLevel
    {
        public int Id { get; set; }
        [Required]
        [StringLength(20)]
        public string Name { get; set; }
        [Required]
        public int Order { get; set; }
    }
}