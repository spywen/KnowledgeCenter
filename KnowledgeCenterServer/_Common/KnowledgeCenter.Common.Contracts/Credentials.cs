using System.ComponentModel.DataAnnotations;

namespace KnowledgeCenter.Common.Contracts
{
    public class Credentials
    {
        [Required]
        public string Login { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
