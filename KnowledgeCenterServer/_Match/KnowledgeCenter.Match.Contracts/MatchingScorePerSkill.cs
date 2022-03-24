namespace KnowledgeCenter.Match.Contracts
{
    public class MatchingScorePerSkill
    {
        public int Id { get; set; }
        public int MatchingId { get; set; }
        public Matching Matching { get; set; }
        public int SkillLevelId { get; set; }
        public SkillLevel SkillLevel { get; set; }
        public int CustomerOfferSkillId { get; set; }
        public CustomerOfferSkill CustomerOfferSkill { get; set; }
        public double Score { get; set; }
    }
}