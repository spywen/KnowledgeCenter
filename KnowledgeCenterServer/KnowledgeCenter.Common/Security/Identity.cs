using System.Collections.Generic;

namespace KnowledgeCenter.Common.Security
{
    public class Identity
    {
        public int Id { get; set; }

        public string Login { get; set; }

        public List<string> Roles { get; set; }

        public bool IsAdmin()
        {
            return Roles.Contains(EnumRoles.ADMIN);
        }

        public bool HasRole(string role)
        {
            return Roles.Contains(EnumRoles.ADMIN) || Roles.Contains(role);
        }
    }
}
