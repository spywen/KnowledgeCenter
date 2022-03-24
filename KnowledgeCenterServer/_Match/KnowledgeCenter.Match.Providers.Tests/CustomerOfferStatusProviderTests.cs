using System;
using System.Linq;
using FluentAssertions;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities.Match;
using Xunit;
using _BaseTests = KnowledgeCenter.Match.Providers.Tests.Helpers._BaseTests;

namespace KnowledgeCenter.Match.Providers.Tests
{
    public class CustomerOfferStatusProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly CustomerOfferStatusProvider _customerOfferStatusProvider;

        public CustomerOfferStatusProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();
            _customerOfferStatusProvider = new CustomerOfferStatusProvider(_knowledgeCenterContextMock, MapperWithoutMock);
        }

        [Fact]
        public void GetAllCustomerOfferStatus_ShouldReturnAllCustomerOfferStatus()
        {
            // Act
            var statusResult = _customerOfferStatusProvider.GetAllCustomerOfferStatus();

            // Assert
            statusResult.Count.Should().Be(2);
            statusResult[0].Should().BeEquivalentTo(new CustomerOfferStatus
            {
                Id = 1,
                Code = "OPEN",
                Description = "OPEN"
            });
            statusResult[1].Should().BeEquivalentTo(new CustomerOfferStatus
            {
                Id = 2,
                Code = "SOURCED",
                Description = "SOURCED"
            });
        }

        [Fact]
        public void GetCustomerOfferStatus_ShouldReturnTheCorrectCustomerOfferStatusForAGivenId()
        {
            // Act
            var statusResult = _customerOfferStatusProvider.GetCustomerOfferStatus(2);

            // Assert
            statusResult.Should()
                .NotBeNull()
                .And.BeEquivalentTo(new CustomerOfferStatus
                {
                    Id = 2,
                    Code = "SOURCED",
                    Description = "SOURCED"
                });
        }

        [Fact]
        public void GetCustomerOfferStatus_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongIdIsGiven()
        {
            // Act
            Action action = () => { _customerOfferStatusProvider.GetCustomerOfferStatus(12); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();


            var open = new CustomerOfferStatus
            {
                Id = 1,
                Code = "OPEN",
                Description = "OPEN"
            };
            var sourced = new CustomerOfferStatus
            {
                Id = 2,
                Code = "SOURCED",
                Description = "SOURCED"
            };

            knowledgeCenterContextMock.CustomerOffersStatus.Add(open);
            knowledgeCenterContextMock.CustomerOffersStatus.Add(sourced);

            knowledgeCenterContextMock.SaveChanges();

            return knowledgeCenterContextMock;
        }

        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}