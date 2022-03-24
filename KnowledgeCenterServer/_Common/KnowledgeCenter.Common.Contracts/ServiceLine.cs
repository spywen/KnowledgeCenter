using System.ComponentModel.DataAnnotations;

namespace KnowledgeCenter.Common.Contracts
{
    public class ServiceLine
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        [RegularExpression(@"^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$")]
        public string Name { get; set; }

        [Required]
        [StringLength(100)]
        public string Description { get; set; }
    }
}