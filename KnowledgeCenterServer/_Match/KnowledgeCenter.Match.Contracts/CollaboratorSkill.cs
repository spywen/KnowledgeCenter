using System.ComponentModel.DataAnnotations;

namespace KnowledgeCenter.Match.Contracts
{
    public class CollaboratorSkill
    {
        public int Id { get; set; }
        [Required]
        public int SkillId { get; set; }
        public Skill Skill { get; set; }
        [Required]
        public int SkillLevelId { get; set; }
        public SkillLevel SkillLevel { get; set; }
    }
}