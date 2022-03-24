using System.ComponentModel.DataAnnotations;

namespace KnowledgeCenter.Common.Contracts
{
    public class Role
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Code { get; set; }

        [Required]
        [StringLength(100)]
        public string Description { get; set; }
    }
}
