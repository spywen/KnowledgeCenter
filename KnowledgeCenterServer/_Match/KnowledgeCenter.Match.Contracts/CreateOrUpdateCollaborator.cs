using System.ComponentModel.DataAnnotations;

namespace KnowledgeCenter.Match.Contracts
{
    public class CreateOrUpdateCollaborator
    {
        public int Id { get; set; }

        [Required]
        [RegularExpression(@"^(\d{8})$")]
        public int GGID { get; set; }

        [Required]
        [StringLength(50)]
        public string Firstname { get; set; }

        [Required]
        [StringLength(50)]
        public string Lastname { get; set; }

        [Required]
        [StringLength(100)]
        [RegularExpression(@"^([\w\.\-]+)@capgemini.com$")]
        public string Email { get; set; }

        [Required]
        public int AgencyId { get; set; }

        public int? ServiceLineId { get; set; }
    }
}