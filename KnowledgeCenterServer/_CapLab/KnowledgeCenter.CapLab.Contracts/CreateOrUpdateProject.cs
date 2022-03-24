using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace KnowledgeCenter.CapLab.Contracts
{
    public class CreateOrUpdateProject
    {
        public int Id { get; set; }

        [Required, MaxLength(140)]
        public string Title { get; set; }
        
        [Required, MaxLength(300)]
        public string ShortDescription { get; set; }
        
        public string Description { get; set; }

        public string Image { get; set; }

        public ICollection<int> TagIds { get; set; }
    }
}
