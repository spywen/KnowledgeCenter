using System;

namespace KnowledgeCenter.Green.Contracts
{
    public class Publication
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModificationDate { get; set; }
        public DateTime PublicationDate { get; set; }
        public bool IsPublished { get; set; }
        public int PublicationTypeId { get; set; }
        public PublicationType PublicationType { get; set; }
        public int UserId {get; set;}
        public User User { get; set; }
    }
}
