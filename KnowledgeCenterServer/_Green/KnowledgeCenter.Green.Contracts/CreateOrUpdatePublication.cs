using System;
using System.ComponentModel.DataAnnotations;

namespace KnowledgeCenter.Green.Contracts
{
    public class CreateOrUpdatePublication
    {
        public int Id { get; set; }
        [Required, MaxLength(400)]
        public string Message { get; set; }
        [Required]
        public DateTime PublicationDate { get; set; }
        [Required]
        public int PublicationTypeId { get; set; }
    }
}
