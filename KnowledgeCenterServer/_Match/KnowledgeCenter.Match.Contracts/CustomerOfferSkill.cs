using System.ComponentModel.DataAnnotations;
using System;

namespace KnowledgeCenter.Match.Contracts
{
    public class CustomerOfferSkill
    {
        public int Id { get; set; }

        [Required]
        public int SkillId { get; set; }
        public Skill Skill { get; set; }
        
        [Required]
        public int SkillLevelId { get; set; }
        public SkillLevel SkillLevel { get; set; }
        
        [Required]
        public int SkillPriority { get; set; }
    }
}