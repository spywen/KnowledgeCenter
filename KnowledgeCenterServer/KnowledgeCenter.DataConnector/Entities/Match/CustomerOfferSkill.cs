using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities.Match
{
    [Table("Match.CustomerOfferSkill")]
    public class CustomerOfferSkill
    {
        public int Id { get; set; }
        public int CustomerOfferId { get; set; }
        public CustomerOffer CustomerOffer { get; set; }
        public int SkillId { get; set; }
        public Skill Skill { get; set; }
        public int SkillLevelId { get; set; }
        public SkillLevel SkillLevel { get; set; }
        public int SkillPriority { get; set; }

    }
}