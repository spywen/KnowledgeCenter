using System.ComponentModel.DataAnnotations;

namespace KnowledgeCenter.Match.Contracts
{
    public class CustomerOfferStatus
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
    }
}