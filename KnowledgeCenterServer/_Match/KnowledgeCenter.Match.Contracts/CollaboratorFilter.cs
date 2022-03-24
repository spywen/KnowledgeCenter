namespace KnowledgeCenter.Match.Contracts
{
    public class CollaboratorFilter
    {
        public string Keyword { get; set; }
        
        public int RoleId { get; set; }
        
        public string RoleCode { get; set; }

        public int AgencyId { get; set; }

        public int ServiceLineId { get; set; }
    }
}