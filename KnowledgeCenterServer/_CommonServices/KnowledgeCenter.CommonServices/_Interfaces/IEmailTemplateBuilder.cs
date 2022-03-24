using KnowledgeCenter.CommonServices.Contracts._Interfaces;

namespace KnowledgeCenter.CommonServices._Interfaces
{
    public interface IEmailTemplateBuilder
    {
        string GenerateEmail(IEmailModel model);
    }
}
