using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities.Flux
{
    [Table("Flux.Publication")]
    public class Publication
    {
        public int Id { get; set; }
        public string CategoryCode { get; set; }
        public string Message { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModificationDate { get; set; }
        public bool IsAnonymous { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public ICollection<Like> LikeCollection { get; set; }
    }
}
