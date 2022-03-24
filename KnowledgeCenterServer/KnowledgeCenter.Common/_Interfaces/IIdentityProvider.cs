using KnowledgeCenter.Common.Security;

namespace KnowledgeCenter.Common._Interfaces
{
    public interface IIdentityProvider
    {
        Identity GetConnectedUserIdentity();
    }
}
