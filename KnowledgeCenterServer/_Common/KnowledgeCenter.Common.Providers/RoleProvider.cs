using KnowledgeCenter.Common.Providers._Interfaces;
using KnowledgeCenter.DataConnector;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Entities = KnowledgeCenter.DataConnector.Entities;

namespace KnowledgeCenter.Common.Providers
{
    public class RoleProvider : IRoleProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IMapper _mapper;

        public RoleProvider(
            KnowledgeCenterContext knowledgeCenterContext,
            IMapper mapper)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _mapper = mapper;
        }

        public List<Contracts.Role> GetAllRoles()
        {
            return _knowledgeCenterContext.Roles
                .Select(x => _mapper.Map<Contracts.Role>(x))
                .ToList();
        }

        public List<Contracts.Role> GetRoles(int userId)
        {
            return _knowledgeCenterContext.Roles
                .Where(x => x.UserRoles.Any(y => y.UserId == userId))
                .Select(x => _mapper.Map<Contracts.Role>(x))
                .ToList();
        }

        public List<Contracts.Role> UpdateRoles(int userId, List<int> newRoleIds)
        {
            var currentRoles = GetRoles(userId).Select(x => x.Id);
            var diff = currentRoles.Except(newRoleIds).Concat(newRoleIds.Except(currentRoles));
            var user = _knowledgeCenterContext.Users.Include(x => x.UserRoles).First(x => x.Id == userId);
            foreach (var id in diff)
            {
                if (newRoleIds.Contains(id)) // ADDED
                {
                    user.UserRoles.Add(new Entities.UserRoles { RoleId = id });
                }
                else // REMOVED
                {
                    var currentRole = user.UserRoles.First(x => x.RoleId == id);
                    user.UserRoles.Remove(currentRole);
                }
            }
            _knowledgeCenterContext.SaveChanges();
            return GetRoles(userId);
        }
    }
}
