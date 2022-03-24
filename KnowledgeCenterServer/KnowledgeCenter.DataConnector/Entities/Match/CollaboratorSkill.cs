using System.ComponentModel.DataAnnotations.Schema;
namespace KnowledgeCenter.DataConnector.Entities.Match
{
    [Table("Match.CollaboratorSkills")]
    public class CollaboratorSkill
    {
        public int Id { get; set; }
        public int CollaboratorId { get; set; }
        public Collaborator Collaborator { get; set; }
        public int SkillId { get; set; }
        public Skill Skill { get; set; }
        public int SkillLevelId { get; set; }
        public SkillLevel SkillLevel { get; set; }
    }
}