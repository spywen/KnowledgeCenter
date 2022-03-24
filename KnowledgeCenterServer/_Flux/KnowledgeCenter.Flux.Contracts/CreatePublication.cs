using KnowledgeCenter.Common.Validators;
using System.ComponentModel.DataAnnotations;

namespace KnowledgeCenter.Flux.Contracts
{
    public class CreatePublication
    {
        public int Id { get; set; }

        [Required, HtmlTextSizeValidator(1, 400)]
        public string Message { get; set; }

        [Required]
        public CategoryCode CategoryCode { get; set; }

        [Required]
        public bool IsAnonymous { get; set; }
    }
}
