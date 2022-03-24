using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities.Match
{
    [Table("Match.CustomerOfferStatus")]
    public class CustomerOfferStatus
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
    }
}