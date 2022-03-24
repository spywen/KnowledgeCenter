using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace KnowledgeCenter.Match.Contracts
{
    public class Customer
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Name { get; set; }
    }
}