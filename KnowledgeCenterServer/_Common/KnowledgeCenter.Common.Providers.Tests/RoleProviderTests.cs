using FluentAssertions;
using KnowledgeCenter.Common.Providers.Tests.Helpers;
using KnowledgeCenter.Common.Security;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using FizzWare.NBuilder;
using Xunit;

namespace KnowledgeCenter.Common.Providers.Tests
{
    public class RoleProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;

        private readonly RoleProvider _roleProvider;

        public RoleProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();

            _roleProvider = new RoleProvider(_knowledgeCenterContextMock, MapperWithoutMock);
        }

        [Fact]
        public void GetAllRoles_ShouldReturnAllAvailableRoles()
        {
            // Act
            var result = _roleProvider.GetAllRoles();

            // Assert
            result.Count.Should().Be(1);
            result[0].Code.Should().Be(EnumRoles.ADMIN);
        }

        [Fact]
        public void GetRoles_ShouldReturnUserRoles()
        {
            // Act
            var result = _roleProvider.GetRoles(1);

            // Assert
            result.Count.Should().Be(1);
            result.First().Code.Should().Be(EnumRoles.ADMIN);
        }

        [Fact]
        public void UpdateRoles_ShouldRemoveRoleToUser()
        {
            // Act
            var result = _roleProvider.UpdateRoles(1, new List<int>());// No roles now

            // Assert
            var userRoles = _knowledgeCenterContextMock.Users.Include(x => x.UserRoles).First(x => x.Id == 1).UserRoles;
            userRoles.Count.Should().Be(0);
        }

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();

            var adminRole = new Role
            {
                Code = EnumRoles.ADMIN,
                Description = "Administrator"
            };
            knowledgeCenterContextMock.Roles.Add(adminRole);

            knowledgeCenterContextMock.Agencies.Add(GetAgency());
            knowledgeCenterContextMock.ServiceLines.Add(GetServiceLine());

            var adminUser = new User
            {
                Login = "Bob",
                UserRoles = new List<UserRoles>{
                        new UserRoles { Role = adminRole }
                    },
                AgencyId = 1,
                ServiceLineId = 1
            };
            var user = new User
            {
                Login = "Bob",
                AgencyId = 1,
                ServiceLineId = 1
            };
            knowledgeCenterContextMock.Users.Add(adminUser);
            knowledgeCenterContextMock.Users.Add(user);

            knowledgeCenterContextMock.SaveChanges();

            return knowledgeCenterContextMock;
        }

        private Agency GetAgency()
        {
            return Builder<Agency>.CreateNew()
                .With(x => x.Id, 1)
                .And(x => x.Name, "Sophia-Antipolis")
                .And(x => x.PostalCode, "06560")
                .Build();
        }

        private ServiceLine GetServiceLine()
        {
            return Builder<ServiceLine>.CreateNew()
                .With(x => x.Id, 1)
                .And(x => x.Name, "Agile Center")
                .And(x => x.Description, "Agile Center Service Line")
                .Build();
        }

        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}
