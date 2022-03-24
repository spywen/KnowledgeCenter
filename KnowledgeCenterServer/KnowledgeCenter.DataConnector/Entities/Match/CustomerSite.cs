using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities.Match
{
    [Table("Match.CustomerSite")]
    public class CustomerSite
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CustomerId { get; set; }
        public Customer Customer { get; set; }
        public string Address { get; set; }
        public string Contact { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModificationDate { get; set; }
    }
}