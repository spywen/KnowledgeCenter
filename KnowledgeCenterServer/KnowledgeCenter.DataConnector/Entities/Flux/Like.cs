using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities.Flux
{
    [Table("Flux.Like")]
    public class Like
    {
        public int Id { get; set; }
        public int PublicationId { get; set; }
        public Publication Publication { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public DateTime CreationDate { get; set; }
        public string LikeCode { get; set; }
    }
}
