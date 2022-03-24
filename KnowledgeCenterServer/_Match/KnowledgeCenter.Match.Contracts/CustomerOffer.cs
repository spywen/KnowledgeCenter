using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System;
using KnowledgeCenter.Match.Contracts.CustomValidations;

namespace KnowledgeCenter.Match.Contracts
{
    public class CustomerOffer
    {
        public int Id { get; set; }

        [Required]
        [StringLength(40)]
        public string JobTitle { get; set; }

        [StringLength(40)]
        public string Requester { get; set; }
        
        [Required]
        public DateTime CreationDate { get; set; }

        [Required]
        public DateTime MissionStartDate { get; set; }

        public DateTime MissionEndDate { get; set; }
        public bool MobilityRequired { get; set; }
        public bool OnSite { get; set; }
        public bool WorkFromHome { get; set; }

        [Required]
        public int CustomerOfferStatusId { get; set; }
        public CustomerOfferStatus CustomerOfferStatus { get; set; }
        
        public string Description { get; set; }

        [Required]
        public int CustomerAccountManagerId { get; set; }
        public User CustomerAccountManager { get; set; }

        [Required]
        public int CustomerSiteId { get; set; }
        public CustomerSite CustomerSite { get; set; }
        
        public List<CustomerOfferSkill> CustomerOfferSkills { get; set; }
    }
}