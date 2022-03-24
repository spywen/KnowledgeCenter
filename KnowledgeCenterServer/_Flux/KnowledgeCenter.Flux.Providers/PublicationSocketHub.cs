using KnowledgeCenter.Common.Security;
using KnowledgeCenter.Flux.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using System.Threading.Tasks;

namespace KnowledgeCenter.Flux.Providers
{
    public enum PublicationEvent
    {
        CREATED,
        DELETED,
        LIKED
    }

    [Authorize(Roles = EnumRoles.USER)]
    public class PublicationSocketHub : Hub
    {
        public async Task Broadcast(PublicationEvent type, Publication publication)
        {
            await Clients.Others.SendAsync(nameof(Broadcast), type.ToString(), publication);
        }
    }

    public class LoginBasedUserIdProvider : IUserIdProvider
    {
        public virtual string GetUserId(HubConnectionContext connection)
        {
            return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }
}
