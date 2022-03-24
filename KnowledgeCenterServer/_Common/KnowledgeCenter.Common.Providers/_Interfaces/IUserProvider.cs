using KnowledgeCenter.Common.Contracts;
using System.Collections.Generic;

namespace KnowledgeCenter.Common.Providers._Interfaces
{
    public interface IUserProvider
    {
        User CreateUser(CreateOrUpdateUser userFacade);

        string ActivateAccount(string token);

        User UpdateUser(CreateOrUpdateUser userFacade);

        List<User> GetAllUsers();

        User GetConnectedUser();

        User GetUser(int id);

        void DeleteUser(int id);
    }
}
