using System.ComponentModel.DataAnnotations;

namespace KnowledgeCenter.Match.Contracts
{
    public class CustomerSite
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        
        [Required]
        public string Address { get; set; }
        
        public string Contact { get; set; }
        
        [Required]
        public int CustomerId { get; set; }
        
        public Customer Customer { get; set; }
    }
}