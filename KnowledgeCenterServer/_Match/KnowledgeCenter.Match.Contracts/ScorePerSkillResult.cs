namespace KnowledgeCenter.Match.Contracts
{
    public class ScorePerSkillResult
    {
        public int CollaboratorId { get; set; }
        public int SkillLevelId { get; set; }
        public int CustomerOfferSkillId { get; set; }
        public double Score { get; set; }
    }
}