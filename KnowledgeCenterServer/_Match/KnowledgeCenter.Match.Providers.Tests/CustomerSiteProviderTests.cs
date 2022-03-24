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
    public class CustomerSiteProviderTests : _BaseTests
    {
        
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly CustomerSiteProvider _customerSiteProvider;

        public CustomerSiteProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();
            _customerSiteProvider = new CustomerSiteProvider(_knowledgeCenterContextMock, MapperWithoutMock);
        }

        [Fact]
        public void GetAllCustomerSites_ShouldReturnAllRegisteredCustomerSitesForAGivenCustomerId()
        {
            // Act
            var customerSitesResult = _customerSiteProvider.GetFilteredCustomerSites(new Common.BasePaginationRequest<CustomerSiteFilter>(null));
            
            // Assert
            customerSitesResult.Data.Count.Should().Be(3);
            customerSitesResult.Data[0].Should().BeEquivalentTo(new Contracts.CustomerSite
            {
                Id = 1,
                Name = "Nice Sophia Antipolis",
                CustomerId = 1,
                Customer = new Contracts.Customer { Id = 1, Name = "Amadeus" },
                Address = "address sophia Cedex 06421",
                Contact = "+33 4 04 04 04 04"
            });
            customerSitesResult.Data[1].Should().BeEquivalentTo(new Contracts.CustomerSite
            {
                Id = 2,
                Name = "Toulouse",
                CustomerId = 1,
                Customer = new Contracts.Customer { Id = 1, Name = "Amadeus" },
                Address = "12, rue toulouse 12345 Toulouse",
                Contact = "+33 4 11 22 33 44. Email: email@amadeus.com"
            });
            customerSitesResult.Data[2].Should().BeEquivalentTo(new Contracts.CustomerSite
            {
                Id = 3,
                Name = "Paris Defense",
                CustomerId = 2,
                Customer = new Contracts.Customer { Id = 2, Name = "Kone" },
                Address = "Kone Paris Defense address",
                Contact = null
            });
        }
        
        [Fact]
        public void GetFilteredCustomerSites_ShouldReturnExpectedCustomerSites_WhenFilteringByCustomerId()
        {
            // Act
            var customerSitesResult = _customerSiteProvider.GetFilteredCustomerSites(new Common.BasePaginationRequest<CustomerSiteFilter>(
                new CustomerSiteFilter { CustomerId = 1 } ));
            
            // Assert
            customerSitesResult.Data.Count.Should().Be(2);
            customerSitesResult.Data[0].Should().BeEquivalentTo(new Contracts.CustomerSite
            {
                Id = 1,
                Name = "Nice Sophia Antipolis",
                CustomerId = 1,
                Customer = new Contracts.Customer { Id = 1, Name = "Amadeus" },
                Address = "address sophia Cedex 06421",
                Contact = "+33 4 04 04 04 04"
            });
            customerSitesResult.Data[1].Should().BeEquivalentTo(new Contracts.CustomerSite
            {
                Id = 2,
                Name = "Toulouse",
                CustomerId = 1,
                Customer = new Contracts.Customer { Id = 1, Name = "Amadeus" },
                Address = "12, rue toulouse 12345 Toulouse",
                Contact = "+33 4 11 22 33 44. Email: email@amadeus.com"
            });
        }
        
        [Fact]
        public void GetFilteredCustomerSites_ShouldReturnExpectedCustomerSites_WhenFilteringByName()
        {
            // Act
            var customerSitesResult = _customerSiteProvider.GetFilteredCustomerSites(new Common.BasePaginationRequest<CustomerSiteFilter>(
                new CustomerSiteFilter { Keyword = "Nice Sophi" } ));
            
            // Assert
            customerSitesResult.Data.Count.Should().Be(1);
            customerSitesResult.Data[0].Should().BeEquivalentTo(new Contracts.CustomerSite
            {
                Id = 1,
                Name = "Nice Sophia Antipolis",
                CustomerId = 1,
                Customer = new Contracts.Customer { Id = 1, Name = "Amadeus" },
                Address = "address sophia Cedex 06421",
                Contact = "+33 4 04 04 04 04"
            });
        }

        [Fact]
        public void GetFilteredCustomerSites_ShouldReturnExpectedCustomerSites_WhenFilteringByAddress()
        {
            // Act
            var customerSitesResult = _customerSiteProvider.GetFilteredCustomerSites(new Common.BasePaginationRequest<CustomerSiteFilter>(
                new CustomerSiteFilter { Keyword = "rue toulouse" } ));
            
            // Assert
            customerSitesResult.Data.Count.Should().Be(1);
            customerSitesResult.Data[0].Should().BeEquivalentTo(new Contracts.CustomerSite
            {
                Id = 2,
                Name = "Toulouse",
                CustomerId = 1,
                Customer = new Contracts.Customer { Id = 1, Name = "Amadeus" },
                Address = "12, rue toulouse 12345 Toulouse",
                Contact = "+33 4 11 22 33 44. Email: email@amadeus.com"
            });
        }
        
        [Fact]
        public void GetCustomerSite_ShouldReturnTheCorrectCustomerSiteForAGivenId()
        {
            // Act
            var customerSiteResult = _customerSiteProvider.GetCustomerSite(1);
            
            // Assert
            customerSiteResult.Should()
                .NotBeNull()
                .And.BeEquivalentTo(new Contracts.CustomerSite
                {
                    Id = 1,
                    Name = "Nice Sophia Antipolis",
                    CustomerId = 1,
                    Customer = new Contracts.Customer { Id = 1, Name = "Amadeus" },
                    Address = "address sophia Cedex 06421",
                    Contact = "+33 4 04 04 04 04"
                
                });
        }

        [Fact]
        public void GetCustomerSite_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongCustomerSiteIdIsGiven()
        {
            // Act
            Action action = () => { _customerSiteProvider.GetCustomerSite(1234); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }
        
        [Fact]
        public void CreateCustomerSite_ShouldSuccessfullyCreateANewCustomerSite_WhenItDoesNotAlreadyExist()
        {
            // Act
            var customerSiteResult = _customerSiteProvider.CreateCustomerSite(new Contracts.CustomerSite
            {
                Name = "New site for Amadeus",
                CustomerId = 1,
                Address = "new address",
                Contact = "new contact"
            });
            
            // Assert
            customerSiteResult.Should()
                .NotBeNull()
                .And.BeEquivalentTo(new Contracts.CustomerSite
                {
                    Id = 4,
                    Name = "New site for Amadeus",
                    CustomerId = 1,
                    Customer = new Contracts.Customer { Id = 1, Name = "Amadeus" },
                    Address = "new address",
                    Contact = "new contact"
                });
        }
        
        [Fact]
        public void CreateCustomerSite_ShouldSuccessfullyCreateANewCustomerSite_WhenItDoesNotAlreadyExistForTheSameCustomerName()
        {
            // Act
            var customerSiteResult = _customerSiteProvider.CreateCustomerSite(new Contracts.CustomerSite
            {
                Name = "Nice Sophia Antipolis",
                CustomerId = 2,
                Address = "Kone new address",
                Contact = "Kone new contact"
            });
            
            // Assert
            customerSiteResult.Should()
                .NotBeNull()
                .And.BeEquivalentTo(new Contracts.CustomerSite
                {
                    Id = 4,
                    Name = "Nice Sophia Antipolis",
                    CustomerId = 2,
                    Customer = new Contracts.Customer { Id = 2, Name = "Kone" },
                    Address = "Kone new address",
                    Contact = "Kone new contact"
                });
        }
        
        [Fact]
        public void CreateCustomerSite_ShouldThrow_CUSTOMERSITE_ALREADYEXISTS_Exception_WhenACustomerSiteWithTheSameNameAndTheSameCustomerNameAlreadyExist()
        {
            // Act
            Action action = () => { _customerSiteProvider.CreateCustomerSite(new Contracts.CustomerSite
                {
                    Name = "Nice Sophia Antipolis",
                    CustomerId = 1,
                    Address = "Amadeus new address",
                    Contact = "Amadeus new contact"
                }); 
            };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.CUSTOMERSITE_ALREADYEXISTS);
        }
        
        [Fact]
        public void DeleteCustomerSite_ShouldSuccessfullyDeleteTheCustomerSiteCorrespondingToTheGivenId()
        {
            // Act
            _customerSiteProvider.DeleteCustomerSite(1);
            
            // Assert
            _knowledgeCenterContextMock.Customers.Count().Should().Be(2);
        }
        
        [Fact]
        public void DeleteCustomerSite_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongCustomerSiteIdIsGiven()
        {
            // Act
            Action action = () => { _customerSiteProvider.DeleteCustomerSite(123); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }
        
        [Fact]
        public void UpdateCustomerSite_ShouldSuccessfullyUpdateTheCustomerSiteCorrespondingToTheGivenId_WhenItDoesNotAlreadyExist()
        {
            // Act
            var customerResult = _customerSiteProvider.UpdateCustomerSite(1, new Contracts.CustomerSite
            {
                Id = 1,
                Name = "Nice",
                CustomerId = 1,
                Address = "address Nice 06000",
                Contact = "+33 4 04 04 04 04"
            });
            
            // Assert
            customerResult.Should()
                .NotBeNull()
                .And.BeEquivalentTo(new Contracts.CustomerSite
                {
                    Id = 1,
                    Name = "Nice",
                    CustomerId = 1,
                    Customer = new Contracts.Customer { Id = 1, Name = "Amadeus" },
                    Address = "address Nice 06000",
                    Contact = "+33 4 04 04 04 04"
                });
        }
        
        [Fact]
        public void UpdateCustomerSite_ShouldSuccessfullyUpdateTheCustomerSiteCorrespondingToTheGivenId_WithoutChangeTheCustomerLinked()
        {
            // Act
            var customerResult = _customerSiteProvider.UpdateCustomerSite(1, new Contracts.CustomerSite
            {
                Id = 1,
                Name = "Nice",
                CustomerId = 2,
                Address = "address Nice 06000",
                Contact = "+33 4 04 04 04 04"
            });
            
            // Assert
            customerResult.Should()
                .NotBeNull()
                .And.BeEquivalentTo(new Contracts.CustomerSite
                {
                    Id = 1,
                    Name = "Nice",
                    CustomerId = 1,
                    Customer = new Contracts.Customer { Id = 1, Name = "Amadeus" },
                    Address = "address Nice 06000",
                    Contact = "+33 4 04 04 04 04"
                });
        }
        
        [Fact]
        public void UpdateCustomerSite_ShouldSuccessfullyUpdateTheCustomerSiteCorrespondingToTheGivenId_WhenItDoesNotAlreadyExistForTheSameCustomerName()
        {
            // Act
            var customerResult = _customerSiteProvider.UpdateCustomerSite(3, new Contracts.CustomerSite
            {
                Id = 3,
                Name = "Toulouse",
                CustomerId = 2,
                Address = "address Toulouse Kone",
                Contact = "contact Toulouse Kone"
            });
            
            // Assert
            customerResult.Should()
                .NotBeNull()
                .And.BeEquivalentTo(new Contracts.CustomerSite
                {
                    Id = 3,
                    Name = "Toulouse",
                    CustomerId = 2,
                    Customer = new Contracts.Customer { Id = 2, Name = "Kone" },
                    Address = "address Toulouse Kone",
                    Contact = "contact Toulouse Kone"
                });
        }
        
        [Fact]
        public void UpdateCustomerSite_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongCustomerSiteIdIsGiven()
        {
            // Act
            Action action = () => { _customerSiteProvider.UpdateCustomerSite(123, new Contracts.CustomerSite
            {
                Id = 123,
                Name = "Updated site for Amadeus",
                CustomerId = 1,
                Address = "updated address",
                Contact = "updated contact"
            }); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }
        
        [Fact]
        public void UpdateCustomerSite_ShouldThrow_CUSTOMERSITE_ALREADYEXISTS_Exception_WhenACustomerSiteWithTheSameNameAlreadyExistsForTheSameCustomerName()
        {
            // Act
            Action action = () => { _customerSiteProvider.UpdateCustomerSite(1, new Contracts.CustomerSite
            {
                Id = 1,
                Name = "Toulouse",
                CustomerId = 1,
                Address = "Nice becomes Toulouse address",
                Contact = "Nice becomes Toulouse contact"
            }); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.CUSTOMERSITE_ALREADYEXISTS);
        }

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();

            knowledgeCenterContextMock.Customers.AddRange(GetCustomers());
            knowledgeCenterContextMock.CustomersSites.AddRange(GetCustomersSites());
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

        private IList<CustomerSite> GetCustomersSites()
        {
            return Builder<CustomerSite>.CreateListOfSize(3)
                .All()
                .With(x => x.CreationDate, new DateTime(2019, 1, 2))
                .And(x => x.ModificationDate, new DateTime(2019, 1, 2))
                .TheFirst(1)
                .With(x => x.Id, 1)
                .And(x => x.Name, "Nice Sophia Antipolis")
                .And(x => x.CustomerId, 1)
                .And(x => x.Address, "address sophia Cedex 06421")
                .And(x => x.Contact, "+33 4 04 04 04 04")
                .TheNext(1)
                .With(x => x.Id, 2)
                .And(x => x.Name, "Toulouse")
                .And(x => x.CustomerId, 1)
                .And(x => x.Address, "12, rue toulouse 12345 Toulouse")
                .And(x => x.Contact, "+33 4 11 22 33 44. Email: email@amadeus.com")
                .TheNext(1)
                .With(x => x.Id, 3)
                .And(x => x.Name, "Paris Defense")
                .And(x => x.CustomerId, 2)
                .And(x => x.Address, "Kone Paris Defense address")
                .And(x => x.Contact, null)
                .Build();
        }
        
        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}