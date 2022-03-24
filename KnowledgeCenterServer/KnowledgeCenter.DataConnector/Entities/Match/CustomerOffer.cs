using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace KnowledgeCenter.DataConnector.Entities.Match
{
    [Table("Match.CustomerOffer")]
    public class CustomerOffer
    {
        public int Id { get; set; }
        public string JobTitle { get; set; }
        public string Requester { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModificationDate { get; set; }
        public DateTime MissionStartDate { get; set; }
        public DateTime? MissionEndDate { get; set; }
        public bool MobilityRequired { get; set; }
        public bool OnSite { get; set; }
        public bool WorkFromHome { get; set; }
        public int CustomerOfferStatusId { get; set; }
        public CustomerOfferStatus CustomerOfferStatus { get; set; }
        public string Description {get; set;}
        public int CustomerAccountManagerId { get; set; }
        public User CustomerAccountManager { get; set; }

        public int CustomerSiteId { get; set; }
        public CustomerSite CustomerSite { get; set; }
        public ICollection<CustomerOfferSkill> CustomerOfferSkills { get; set; }
    }
}