using System.ComponentModel.DataAnnotations;

namespace KnowledgeCenter.Common.Contracts
{
    public class CreateOrUpdateUser
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Login { get; set; }

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

        [StringLength(200)]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }

        [StringLength(200)]
        [DataType(DataType.Password)]
        public string OldPassword { get; set; }

        public bool IsActive { get; set; }

        public int PasswordTryCount { get; set; }
        
        [Required]
        public int AgencyId { get; set; }

        public int ServiceLineId { get; set; }
    }
}
