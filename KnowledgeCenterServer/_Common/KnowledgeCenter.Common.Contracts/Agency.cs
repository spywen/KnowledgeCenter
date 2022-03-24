using System.ComponentModel.DataAnnotations;

namespace KnowledgeCenter.Common.Contracts
{
    public class Agency
    { 
        public int Id { get; set; }
        
        [Required]
        [RegularExpression(@"^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$")]
        [StringLength(50, MinimumLength = 3)]
        public string Name { get; set; }
        
        [Required]
        [RegularExpression(@"^[0-9]*$")]
        [StringLength(5, MinimumLength = 5)]
        public string PostalCode { get; set; }
    }
}