using System.ComponentModel.DataAnnotations;

namespace KnowledgeCenter.Common.Contracts
{
    public class AskForRecoverPassword
    {
        [Required]
        [StringLength(100)]
        [RegularExpression(@"^([\w\.\-]+)@capgemini.com$")]
        public string Email { get; set; }
    }

    public class RecoverPassword
    {
        [Required]
        public string Token { get; set; }

        [Required]
        [StringLength(200)]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }
    }
}
