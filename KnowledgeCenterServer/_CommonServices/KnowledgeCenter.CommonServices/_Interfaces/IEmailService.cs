using KnowledgeCenter.CommonServices.Contracts._Interfaces;
using KnowledgeCenter.DataConnector.Entities;

namespace KnowledgeCenter.CommonServices._Interfaces
{
    public interface IEmailService
    {
        void SendEmail(User to, string subject, IEmailModel model);
    }
}
