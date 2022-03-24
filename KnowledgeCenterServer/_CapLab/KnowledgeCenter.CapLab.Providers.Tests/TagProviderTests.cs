using FizzWare.NBuilder;
using FluentAssertions;
using KnowledgeCenter.CapLab.Contracts;
using KnowledgeCenter.CapLab.Providers.Tests.Helpers;
using KnowledgeCenter.Common._Interfaces;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common.Security;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities.CapLab;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace KnowledgeCenter.CapLab.Providers.Tests
{
    public class TagProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly TagProvider _tagProvider;

        public TagProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();

            _tagProvider = new TagProvider(
                _knowledgeCenterContextMock,
                MapperWithoutMock);

        }

        [Fact]
        public void GetAllTags_ShouldReturnAllTags()
        {
            // Act
            var tags = _tagProvider.GetAllTags();

            // Assert
            tags.Should().NotBeNullOrEmpty();
            tags.Should().HaveCount(2);
        }

     

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();

            var tags = GetTags();

            knowledgeCenterContextMock.Tags.AddRange(tags);

            knowledgeCenterContextMock.SaveChanges();

            return knowledgeCenterContextMock;
        }

        private IList<DataConnector.Entities.CapLab.Tag> GetTags()
        {
            return Builder<DataConnector.Entities.CapLab.Tag>.CreateListOfSize(2)
                .TheFirst(1)
                .With(x => x.Id, 1)
                .And(x => x.Code, "FUN")
                .And(x => x.Description, "#Fun")
                .TheNext(1)
                .With(x => x.Id, 2)
                .And(x => x.Code, "USEFUL")
                .And(x => x.Description, "Userful")
                .Build();
        }
        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}