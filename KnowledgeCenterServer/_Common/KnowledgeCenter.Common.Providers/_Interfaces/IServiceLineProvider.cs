using System.Collections.Generic;
using KnowledgeCenter.Common.Contracts;

namespace KnowledgeCenter.Common.Providers._Interfaces
{
    public interface IServiceLineProvider
    {
        ServiceLine CreateServiceLine(ServiceLine serviceLineFacade);
        List<ServiceLine> GetAllServiceLines();
        ServiceLine GetServiceLine(int serviceLineId);
        ServiceLine UpdateServiceLine(int id, ServiceLine serviceLineFacade);
        void DeleteServiceLine(int id);
    }
}