using System.Collections.Generic;
using KnowledgeCenter.Common.Contracts;

namespace KnowledgeCenter.Common.Providers._Interfaces
{
    public interface IAgencyProvider
    {
        Agency CreateAgency(Agency agencyFacade);

        Agency UpdateAgency(int id, Agency agencyFacade);
        
        List<Agency> GetAllAgencies();

        Agency GetAgency(int id);

        void DeleteAgency(int id);
    }
}