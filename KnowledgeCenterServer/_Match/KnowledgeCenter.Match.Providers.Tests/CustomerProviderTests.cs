using System;
using System.Collections.Generic;
using System.Linq;
using FizzWare.NBuilder;
using FluentAssertions;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.Match.Contracts;
using KnowledgeCenter.Match.Providers.Tests.Helpers;
using Xunit;
using Customer = KnowledgeCenter.DataConnector.Entities.Match.Customer;
using CustomerSite = KnowledgeCenter.DataConnector.Entities.Match.CustomerSite;

namespace KnowledgeCenter.Match.Providers.Tests
{
    public class CustomerProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly CustomerProvider _customerProvider;

        public CustomerProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();
            _customerProvider = new CustomerProvider(_knowledgeCenterContextMock, MapperWithoutMock);
        }

        [Fact]
        public void GetAllCustomers_ShouldReturnAllRegisteredCustomers()
        {
            // Act
            var customersResult = _customerProvider.GetFilteredCustomers(new Common.BasePaginationRequest<CustomerFilter>(null));

            // Assert
            customersResult.Data.Count.Should().Be(2);
            customersResult.Data[0].Should().BeEquivalentTo(new Contracts.Customer {Id = 1, Name = "Amadeus"});
            customersResult.Data[1].Should().BeEquivalentTo(new Contracts.Customer {Id = 2, Name = "Kone"});
        }

        [Fact]
        public void GetFilteredCustomers_ShouldReturnExpectedCustomers_WhenFilteringByName()
        {
            // Act
            var customersResult = _customerProvider.GetFilteredCustomers(new Common.BasePaginationRequest<CustomerFilter>(
                new CustomerFilter {Keyword = "k"}
            ));

            // Assert
            customersResult.Data.Count.Should().Be(1);
            customersResult.Data[0].Should().BeEquivalentTo(new Contracts.Customer {Id = 2, Name = "Kone"});
        }

        [Fact]
        public void GetCustomer_ShouldReturnTheCorrectCustomerForAGivenId()
        {
            // Act
            var customerResult = _customerProvider.GetCustomer(1);

            // Assert
            customerResult.Should()
                .NotBeNull()
                .And.BeEquivalentTo(new Contracts.Customer {Id = 1, Name = "Amadeus"});
        }

        [Fact]
        public void GetCustomer_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongCustomerIdIsGiven()
        {
            // Act
            Action action = () => { _customerProvider.GetCustomer(1234); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void CreateCustomer_ShouldSuccessfullyCreateANewCustomer_WhenItDoesNotAlreadyExist()
        {
            // Act
            var customerResult = _customerProvider.CreateCustomer(new Contracts.Customer {Name = "Doe"});

            // Assert
            customerResult.Should()
                .NotBeNull()
                .And.BeEquivalentTo(new Contracts.Customer {Id = 3, Name = "Doe"});
        }

        [Fact]
        public void CreateCustomer_ShouldThrow_CUSTOMER_ALREADYEXISTS_Exception_WhenACustomerWithTheSameNameAlreadyExists()
        {
            // Act
            Action action = () => { _customerProvider.CreateCustomer(new Contracts.Customer {Name = "Amadeus"}); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.CUSTOMER_ALREADYEXISTS);
        }

        [Fact]
        public void DeleteCustomer_ShouldSuccessfullyDeleteTheCustomerCorrespondingToTheGivenId()
        {
            // Act
            _customerProvider.DeleteCustomer(2);

            // Assert
            _knowledgeCenterContextMock.Customers.Count().Should().Be(1);
            _knowledgeCenterContextMock.CustomersSites.Count().Should().Be(1);
        }

        [Fact]
        public void DeleteCustomer_ShouldSuccessfullyDeleteTheCustomerCorrespondingToTheGivenId_AndDeleteCustomerSitesLinkedToThisCustomer()
        {
            // Act
            _customerProvider.DeleteCustomer(1);

            // Assert
            _knowledgeCenterContextMock.Customers.Count().Should().Be(1);
            _knowledgeCenterContextMock.CustomersSites.Count().Should().Be(0);
        }

        [Fact]
        public void DeleteCustomer_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongCustomerIdIsGiven()
        {
            // Act
            Action action = () => { _customerProvider.DeleteCustomer(123); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void UpdateCustomer_ShouldSuccessfullyUpdateTheCustomerCorrespondingToTheGivenId_WhenItDoesNotAlreadyExist()
        {
            // Act
            var customerResult = _customerProvider.UpdateCustomer(1, new Contracts.Customer {Name = "Doe"});

            // Assert
            customerResult.Should()
                .NotBeNull()
                .And.BeEquivalentTo(new Contracts.Customer {Id = 1, Name = "Doe"});
        }

        [Fact]
        public void UpdateCustomer_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongCustomerIdIsGiven()
        {
            // Act
            Action action = () => { _customerProvider.UpdateCustomer(123, new Contracts.Customer {Id = 123, Name = "Doe"}); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }


        [Fact]
        public void UpdateCustomer_ShouldThrow_CUSTOMER_ALREADYEXISTS_Exception_WhenACustomerWithTheSameNameAlreadyExists()
        {
            // Act
            Action action = () => { _customerProvider.UpdateCustomer(1, new Contracts.Customer {Id = 1, Name = "Kone"}); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.CUSTOMER_ALREADYEXISTS);
        }

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();

            knowledgeCenterContextMock.Customers.AddRange(GetCustomers());
            knowledgeCenterContextMock.CustomersSites.Add(GetCustomerSite());
            knowledgeCenterContextMock.SaveChanges();
            return knowledgeCenterContextMock;
        }

        private IList<Customer> GetCustomers()
        {
            return Builder<Customer>.CreateListOfSize(2)
                .All()
                .With(x => x.CreationDate, new DateTime(2019, 1, 2))
                .And(x => x.ModificationDate, new DateTime(2019, 1, 2))
                .TheFirst(1)
                .With(x => x.Id, 1)
                .And(x => x.Name, "Amadeus")
                .TheNext(1)
                .With(x => x.Id, 2)
                .And(x => x.Name, "Kone")
                .Build();
        }

        private CustomerSite GetCustomerSite()
        {
            return new CustomerSite
            {
                Name = "Amadeus site",
                Address = "address",
                CustomerId = 1,
                ModificationDate = new DateTime(2019, 1, 2),
                CreationDate = new DateTime(2019, 1, 2)
            };
        }

        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}