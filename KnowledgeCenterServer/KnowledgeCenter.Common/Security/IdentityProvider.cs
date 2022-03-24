using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Security.Claims;
using KnowledgeCenter.Common._Interfaces;

namespace KnowledgeCenter.Common.Security
{
    public class IdentityProvider : IIdentityProvider
    {
        private IHttpContextAccessor _httpContextAccessor;

        public IdentityProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Identity GetConnectedUserIdentity()
        {
            var identity = _httpContextAccessor.HttpContext.User.Identity as ClaimsIdentity;
            return new Identity
            {
                Id = int.Parse(identity.FindFirst(ClaimTypes.Name).Value),
                Login = identity.FindFirst(ClaimTypes.NameIdentifier).Value,
                Roles = identity.FindAll(CustomClaims.RoleClaimCode).Select(x => x.Value).ToList()
            };
        }
    }
}
