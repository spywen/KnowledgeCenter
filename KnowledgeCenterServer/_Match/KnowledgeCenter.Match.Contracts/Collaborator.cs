using System.Collections.Generic;

namespace KnowledgeCenter.Match.Contracts
{
    public class Collaborator
    {
        public int Id { get; set; }

        public int? GGID { get; set; }

        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public string Email { get; set; }

        public string Fullname
        {
            get
            {
                return $"{Firstname} {Lastname}";
            }
        }
        
        public int AgencyId { get; set; }

        public Agency Agency { get; set; }

        public int ServiceLineId { get; set; }
        
        public ServiceLine ServiceLine { get; set; }

        public List<CollaboratorSkill> CollaboratorSkills { get; set; }
    }
}