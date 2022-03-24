using KnowledgeCenter.CommonServices.Contracts._Interfaces;

namespace KnowledgeCenter.CommonServices.Contracts
{
    public class LayoutModel : IEmailModel
    {
        public string appUrl { get; set; }
        public string username { get; set; }
    }
}
