using System;

namespace KnowledgeCenter.Match.Contracts
{
    public class CustomerOfferFilter
    {
        public string Keyword { get; set; }
        public int CustomerId { get; set; }
        public int AgencyId { get; set; }
        public DateTime CreationDateStart { get; set; }
        public DateTime CreationDateEnd { get; set; }
        public int CustomerAccountManagerId { get; set; }
        public int CustomerOfferStatusId { get; set; }
        public string JobTitle { get; set; }
    }
}