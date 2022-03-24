using KnowledgeCenter.Common.Contracts;
using System.Collections.Generic;

namespace KnowledgeCenter.Common.Providers._Interfaces
{
    public interface IRoleProvider
    {
        List<Role> GetAllRoles();

        List<Role> GetRoles(int userId);

        List<Role> UpdateRoles(int userId, List<int> newRoleIds);
    }
}
