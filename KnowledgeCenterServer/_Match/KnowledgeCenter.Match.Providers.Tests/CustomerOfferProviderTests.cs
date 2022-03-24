using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.Match.Contracts;
using KnowledgeCenter.Match.Providers._Interfaces;
using KnowledgeCenter.Match.Providers.Tests.Helpers;
using Moq;
using Xunit;

namespace KnowledgeCenter.Match.Providers.Tests
{
    public class CustomerOfferProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;
        private readonly CustomerOfferProvider _customerOfferProvider;
        private readonly Mock<IMatchingProvider> _matchingProviderMock = new Mock<IMatchingProvider>();
        private const int CustomerOfferId = 1;

        public CustomerOfferProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();
            _customerOfferProvider = new CustomerOfferProvider(_knowledgeCenterContextMock, MapperWithoutMock, _matchingProviderMock.Object);
        }

        #region Get

        [Fact]
        public void GetAllCustomerOffers_ShouldReturnAllCustomerOffers()
        {
            //Act
            var result = _customerOfferProvider.GetFilteredCustomerOffers(new Common.BasePaginationRequest<CustomerOfferFilter>(null));

            // Assert
            result.Data.Should().HaveCount(1).And.Contain(x => x.Id == CustomerOfferId);
            result.Data[0].Should().BeEquivalentTo(new CustomerOffer
            {
                Id = 1,
                JobTitle = "FrontEnd Developer",
                Requester = "Site Sophia Antipolis",
                MissionStartDate = new DateTime(2019, 10, 01),
                MissionEndDate = new DateTime(2020, 10, 01),
                CreationDate = new DateTime(2019, 08, 30),
                MobilityRequired = true,
                OnSite = false,
                WorkFromHome = true,
                CustomerAccountManagerId = 1,
                CustomerAccountManager = new User
                {
                    Id = 1,
                    Agency = new Agency
                    {
                        Id = 2,
                        Name = "Grimaud",
                        PostalCode = "83310"
                    },
                    Email = "steve.foo@capgemini.com",
                    Firstname = "Steve",
                    Lastname = "Foo",
                    Login = "sfoo",
                    ServiceLine = new ServiceLine
                    {
                        Id = 2,
                        Name = "DTC",
                        Description = "Digital Technology and Cloud",
                    }
                },
                CustomerOfferStatusId = 1,
                CustomerOfferStatus = new CustomerOfferStatus
                {
                    Id = 1,
                    Code = "OPEN",
                    Description = "Open"
                },
                Description = "Post Detail Description",
                CustomerSiteId = 1,
                CustomerSite = new CustomerSite
                {
                    Id = 1,
                    Address = "address sophia Cedex 06421",
                    Contact = "+33 4 04 04 04 04",
                    CustomerId = 1,
                    Customer = new Customer
                    {
                        Id = 1,
                        Name = "Amadeus"
                    },
                    Name = "Nice Sophia Antipolis"
                },
                CustomerOfferSkills = new List<CustomerOfferSkill>
                {
                    new CustomerOfferSkill
                    {
                        Id = 1,
                        SkillId = 1,
                        Skill = new Skill
                        {
                            Id = 1,
                            Name = "Agile",
                            ServiceLine = new ServiceLine {Description = "Agile Center", Id = 1, Name = "Agile Center"},
                            ServiceLineId = 1
                        },
                        SkillLevelId = 1,
                        SkillLevel = new SkillLevel {Id = 1, Name = "Novice", Order = 0},
                        SkillPriority = 1
                    }
                }
            });
        }

        [Fact]
        public void GetAllCustomerOffers_ShouldReturnExpectedCustomerOffer_WhenFilteringByCustomer()
        {
            // Act
            var result = _customerOfferProvider.GetFilteredCustomerOffers(
                new Common.BasePaginationRequest<CustomerOfferFilter>(new CustomerOfferFilter {CustomerId = 1}));

            // Assert
            result.Data.Should().HaveCount(1)
                .And.Contain(x => x.Id == CustomerOfferId);
        }

        [Fact]
        public void GetAllCustomerOffers_ShouldReturnExpectedCustomerOffer_WhenFilteringByCustomerAccountManager()
        {
            // Act
            var result = _customerOfferProvider.GetFilteredCustomerOffers(
                new Common.BasePaginationRequest<CustomerOfferFilter>(new CustomerOfferFilter
                    {CustomerAccountManagerId = 1}));
            // Assert
            result.Data.Should().HaveCount(1)
                .And.Contain(x => x.Id == CustomerOfferId);
        }

        [Fact]
        public void GetAllCustomerOffers_ShouldReturnExpectedCustomerOffer_WhenFilteringByStatus()
        {
            // Act
            var result = _customerOfferProvider.GetFilteredCustomerOffers(
                new Common.BasePaginationRequest<CustomerOfferFilter>(new CustomerOfferFilter
                    {CustomerOfferStatusId = 1}));
            // Assert
            result.Data.Should().HaveCount(1)
                .And.Contain(x => x.Id == CustomerOfferId);
        }

        [Fact]
        public void GetAllCustomerOffers_ShouldReturnExpectedCustomerOffer_WhenFilteringByJobTitle()
        {
            // Act
            var result = _customerOfferProvider.GetFilteredCustomerOffers(
                new Common.BasePaginationRequest<CustomerOfferFilter>(new CustomerOfferFilter
                    {JobTitle = "FrontEnd Developer"}));

            // Assert
            result.Data.Should().HaveCount(1)
                .And.Contain(x => x.Id == CustomerOfferId);
        }

        [Fact]
        public void GetAllCustomerOffers_ShouldReturnExpectedCustomerOffer_WhenFilteringByCreationDate()
        {
            // Act
            var result = _customerOfferProvider.GetFilteredCustomerOffers(
                new Common.BasePaginationRequest<CustomerOfferFilter>(
                    new CustomerOfferFilter
                    {
                        CreationDateStart = new DateTime(2019, 08, 30),
                        CreationDateEnd = new DateTime(2019, 09, 30)
                    })
            );

            // Assert
            result.Data.Should().HaveCount(1)
                .And.Contain(x => x.Id == CustomerOfferId);
        }

        [Fact]
        public void GetAllCustomerOffers_ShouldReturnExpectedCustomerOffer_WhenFilteringByKeyword()
        {
            // Act
            var result = _customerOfferProvider.GetFilteredCustomerOffers(
                new Common.BasePaginationRequest<CustomerOfferFilter>(new CustomerOfferFilter {Keyword = "End"}));

            // Assert
            result.Data.Should().HaveCount(1)
                .And.Contain(x => x.Id == CustomerOfferId);
        }

        [Fact]
        public void GetCustomerOffer_ShouldReturnTheCorrectCustomerOfferForAGivenId()
        {
            // Act
            var result = _customerOfferProvider.GetCustomerOffer(1);
            // Assert 
            result.Id.Should().Equals(CustomerOfferId);
        }

        [Fact]
        public void GetCustomerOffer_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongCustomerOfferIdIsGiven()
        {
            // Act
            Action action = () => { _customerOfferProvider.GetCustomerOffer(5); };

            // Assert
            action.Should()
                .Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        #endregion

        #region Skills

        [Fact]
        public void
            UpdateCustomerOfferSkillLevel_ShouldThrow_ENTITY_NOT_FOUND_Exception_WhenNoCustomerOfferCorrespondsToTheGivenId()
        {
            // Act
            Action action = () =>
            {
                _customerOfferProvider.UpdateCustomerOfferSkillLevel(8, 1, new Contracts.CustomerOfferSkill
                {
                    SkillId = 1,
                    SkillLevelId = 1,
                    SkillPriority = 1
                });
            };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void
            UpdateCustomerOfferSkillLevel_ShouldUpdateTheSkillLevelOfTheCustomerOfferSkillCorrespondingToTheGivenId()
        {
            // Arrange
            var newCustomerOfferSkill = new Contracts.CustomerOfferSkill {SkillId = 1, SkillLevelId = 2, SkillPriority = 1};

            // Act
            _customerOfferProvider.UpdateCustomerOfferSkillLevel(CustomerOfferId, 1, newCustomerOfferSkill);
            var customerOfferSkills = _customerOfferProvider.GetCustomerOfferSkills(CustomerOfferId);

            // Assert
            customerOfferSkills.Should().HaveCount(1)
                .And.ContainEquivalentOf(new CustomerOfferSkill
                {
                    Id = 1,
                    SkillId = 1,
                    Skill = new Skill
                    {
                        Id = 1,
                        Name = "Agile",
                        ServiceLineId = 1,
                        ServiceLine = new ServiceLine
                        {
                            Id = 1,
                            Name = "Agile Center",
                            Description = "Agile Center"
                        }
                    },
                    SkillLevelId = 2,
                    SkillLevel = new SkillLevel
                    {
                        Id = 2,
                        Name = "Expert"
                    },
                    SkillPriority = 1
                });
        }

        [Fact]
        public void
            DeleteCustomerOfferSkill_ShouldThrow_ENTITY_NOT_FOUND_Exception_WhenNoCustomerOfferCorrespondsToTheGivenId()
        {
            // Act
            Action action = () => { _customerOfferProvider.DeleteCustomerOfferSkill(8, 1); };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void DeleteCustomerOfferSkill_ShouldCorrectlyDeleteTheCustomerOfferSkillCorrespondingToTheGivenId()
        {
            // Act
            _customerOfferProvider.DeleteCustomerOfferSkill(CustomerOfferId, 1);
            var customerOfferSkills = _customerOfferProvider.GetCustomerOfferSkills(CustomerOfferId);

            // Assert
            customerOfferSkills.Should().HaveCount(0);
        }

        [Fact]
        public void
            AddCustomerOfferSkill_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenNoCustomerOfferCorrespondsToTheGivenId()
        {
            // Act
            Action action = () =>
            {
                _customerOfferProvider.AddCustomerOfferSkill(8, new Contracts.CustomerOfferSkill
                {
                    SkillId = 2,
                    SkillLevelId = 1,
                    SkillPriority = 2
                });
            };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }
        [Fact]
        public void
            AddCustomerOfferSkill_ShouldThrow_CUSTOMEROFFER_ALREADY_HAS_SKILL_Exception_WhenTheCustomerOfferAlreadyHasTheGivenSkill()
        {
            // Act
            Action action = () =>
            {
                _customerOfferProvider.AddCustomerOfferSkill(1, new Contracts.CustomerOfferSkill
                {
                    SkillId = 1,
                    SkillLevelId = 1,
                    SkillPriority = 2
                });
            };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.CUSTOMEROFFER_ALREADY_HAS_SKILL);
        }
        
        [Fact]
        public void
            AddCustomerOfferSkill_ShouldThrow_CUSTOMEROFFERSKILL_INVALID_PRIORITY_Exception_WhenTheGivenPriorityIsInferiorToZero()
        {
            // Act
            Action action = () =>
            {
                _customerOfferProvider.AddCustomerOfferSkill(1, new Contracts.CustomerOfferSkill
                {
                    SkillId = 2,
                    SkillLevelId = 1,
                    SkillPriority = -1
                });
            };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.CUSTOMEROFFERSKILL_INVALID_PRIORITY);
        }
        
        [Fact]
        public void
            AddCustomerOfferSkill_ShouldThrow_CUSTOMEROFFERSKILL_PRIORITY_ALREADY_ASSIGNED_Exception_WhenAnotherSkillAlreadyHasTheSamePriority()
        {
            // Act
            Action action = () =>
            {
                _customerOfferProvider.AddCustomerOfferSkill(1, new Contracts.CustomerOfferSkill
                {
                    SkillId = 2,
                    SkillLevelId = 1,
                    SkillPriority = 1
                });
            };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.CUSTOMEROFFERSKILL_PRIORITY_ALREADY_ASSIGNED);
        }

        [Fact]
        public void
            AddCustomerOfferSkill_ShouldThrow_CustomerOffer_ALREADY_HAS_SKILL_Exception_WhenTheCustomerOfferAlreadyHasTheGivenSkill()
        {
            // Act
            Action action = () =>
            {
                _customerOfferProvider.AddCustomerOfferSkill(1, new Contracts.CustomerOfferSkill
                {
                    SkillId = 1,
                    SkillLevelId = 1,
                    SkillPriority = 1
                });
            };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.CUSTOMEROFFER_ALREADY_HAS_SKILL);
        }

        [Fact]
        public void AddCustomerOfferSkill_ShouldCorrectlyAddTheCustomerOfferSkill()
        {
            // Act
            _customerOfferProvider.AddCustomerOfferSkill(CustomerOfferId, new Contracts.CustomerOfferSkill
            {
                SkillId = 2,
                SkillLevelId = 1,
                SkillPriority = 2
            });
            var customerOfferSkills = _customerOfferProvider.GetCustomerOfferSkills(CustomerOfferId);

            // Assert
            customerOfferSkills.Should().HaveCount(2);
        }

        [Fact]
        public void
            GetCustomerOfferSkills_ShouldReturnAllTheSkillsAssociatedWithTheCustomerOfferCorrespondingToTheGivenId()
        {
            // Act
            var customerOfferSkills = _customerOfferProvider.GetCustomerOfferSkills(1);

            // Assert
            customerOfferSkills.Should().HaveCount(1)
                .And.ContainEquivalentOf(new CustomerOfferSkill
                {
                    Id = 1,
                    SkillId = 1,
                    Skill = new Skill
                    {
                        Id = 1,
                        Name = "Agile",
                        ServiceLineId = 1,
                        ServiceLine = new ServiceLine
                        {
                            Id = 1,
                            Name = "Agile Center",
                            Description = "Agile Center"
                        }
                    },
                    SkillLevelId = 1,
                    SkillLevel = new SkillLevel
                    {
                        Id = 1,
                        Name = "Novice"
                    },
                    SkillPriority = 1
                });
        }

        [Fact]
        public void GetCustomerOfferSkills_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongIdIsGiven()
        {
            // Act
            Action action = () => { _customerOfferProvider.GetCustomerOfferSkills(7); };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void UpdateCustomerOfferSkills_ShouldDeleteExistingSkillAndReplaceByAnother()
        {
            // Arrange
            var newSkillsList = new List<Contracts.CustomerOfferSkill>
            {
                new Contracts.CustomerOfferSkill {SkillId = 2, SkillLevelId = 2, SkillPriority = 2}
            };

            // Act
            _customerOfferProvider.UpdateCustomerOfferSkills(CustomerOfferId, newSkillsList);
            var customerOfferSkills = _customerOfferProvider.GetCustomerOfferSkills(CustomerOfferId);

            // Assert
            customerOfferSkills.Should().HaveCount(1).And.ContainEquivalentOf(new CustomerOfferSkill
            {
                Id = 2,
                SkillId = 2,
                Skill = new Skill
                {
                    Id = 2,
                    Name = "SCRUM",
                    ServiceLineId = 1,
                    ServiceLine = new ServiceLine
                    {
                        Id = 1,
                        Name = "Agile Center",
                        Description = "Agile Center"
                    }
                },
                SkillLevelId = 2,
                SkillLevel = new SkillLevel
                {
                    Id = 2,
                    Name = "Expert"
                },
                SkillPriority = 2
            });
        }

        [Fact]
        public void UpdateCustomerOfferSkills_ShouldDeleteSkill()
        {
            // Arrange
            var newSkillsList = new List<Contracts.CustomerOfferSkill>();

            // Act
            _customerOfferProvider.UpdateCustomerOfferSkills(CustomerOfferId, newSkillsList);
            var customerOfferSkills = _customerOfferProvider.GetCustomerOfferSkills(CustomerOfferId);

            // Assert
            customerOfferSkills.Should().HaveCount(0);
        }

        [Fact]
        public void UpdateCustomerOfferSkills_ShouldUpdateSkill()
        {
            // Arrange
            var newSkillsList = new List<Contracts.CustomerOfferSkill>
            {
                new Contracts.CustomerOfferSkill {SkillId = 1, SkillLevelId = 2, SkillPriority = 1}
            };

            // Act
            _customerOfferProvider.UpdateCustomerOfferSkills(CustomerOfferId, newSkillsList);
            var customerOfferSkills = _customerOfferProvider.GetCustomerOfferSkills(CustomerOfferId);

            // Assert
            customerOfferSkills.Should().HaveCount(1)
                .And.ContainEquivalentOf(new CustomerOfferSkill
                {
                    Id = 1,
                    SkillId = 1,
                    Skill = new Skill
                    {
                        Id = 1,
                        Name = "Agile",
                        ServiceLineId = 1,
                        ServiceLine = new ServiceLine
                        {
                            Id = 1,
                            Name = "Agile Center",
                            Description = "Agile Center"
                        }
                    },
                    SkillLevelId = 2,
                    SkillLevel = new SkillLevel
                    {
                        Id = 2,
                        Name = "Expert"
                    },
                    SkillPriority = 1
                });
        }

        [Fact]
        public void UpdateCustomerOfferSkills_ShouldAddSkill()
        {
            // Arrange
            var newSkillsList = new List<Contracts.CustomerOfferSkill>
            {
                new Contracts.CustomerOfferSkill {SkillId = 1, SkillLevelId = 1, SkillPriority = 1},
                new Contracts.CustomerOfferSkill {SkillId = 2, SkillLevelId = 1, SkillPriority = 0}
            };

            // Act
            _customerOfferProvider.UpdateCustomerOfferSkills(CustomerOfferId, newSkillsList);
            var customerOfferSkills = _customerOfferProvider.GetCustomerOfferSkills(CustomerOfferId);

            // Assert
            customerOfferSkills.Should().HaveCount(2)
                .And.ContainEquivalentOf(new CustomerOfferSkill
                    {
                        Id = 2,
                        SkillId = 2,
                        Skill = new Skill
                        {
                            Id = 2,
                            Name = "SCRUM",
                            ServiceLineId = 1,
                            ServiceLine = new ServiceLine
                            {
                                Id = 1,
                                Name = "Agile Center",
                                Description = "Agile Center"
                            }
                        },
                        SkillLevelId = 1,
                        SkillLevel = new SkillLevel
                        {
                            Id = 1,
                            Name = "Novice"
                        },
                        SkillPriority = 0
                    }
                );
        }

        [Fact]
        public void UpdateCustomerOfferSkills_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenAWrongIdIsGiven()
        {
            // Act
            var newSkillsList = new List<Contracts.CustomerOfferSkill>
            {
                new Contracts.CustomerOfferSkill {SkillId = 2, SkillLevelId = 2, SkillPriority = 2},
                new Contracts.CustomerOfferSkill {SkillId = 3, SkillLevelId = 1, SkillPriority = 3}
            };

            Action action = () => { _customerOfferProvider.UpdateCustomerOfferSkills(4, newSkillsList); };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void UpdateCustomerOfferSkills_ShouldThrow_INVALID_OPERATION_Exception_WhenDuplicateSkillsWereFound()
        {
            // Act
            var newSkillsList = new List<Contracts.CustomerOfferSkill>
            {
                new Contracts.CustomerOfferSkill {SkillId = 1, SkillLevelId = 1, SkillPriority = 1},
                new Contracts.CustomerOfferSkill {SkillId = 1, SkillLevelId = 2, SkillPriority = 2}
            };

            Action action = () => { _customerOfferProvider.UpdateCustomerOfferSkills(1, newSkillsList); };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.INVALID_ACTION);
        }

        #endregion

        #region CRUD

        [Fact]
        public void CreateCustomerOffer_ShouldCreateANewCustomerOffer()
        {
            // Act
            var customerOffer = _customerOfferProvider.CreateCustomerOffer(
                new CustomerOffer
                {
                    JobTitle = "FrontEnd Developer",
                    Requester = "Site Sophia Antipolis",
                    MissionStartDate = new DateTime(2019, 10, 01),
                    MissionEndDate = new DateTime(2019, 10, 01),
                    MobilityRequired = true,
                    OnSite = false,
                    WorkFromHome = true,
                    CustomerOfferStatusId = 1,
                    Description = "Post Detail Description",
                    CustomerAccountManagerId = 1,
                    CustomerSiteId = 1
                });

            var expectedCustomerOffer = new CustomerOffer
            {
                Id = 2,
                JobTitle = "FrontEnd Developer",
                Requester = "Site Sophia Antipolis",
                CreationDate = DateTime.Now,
                MissionStartDate = new DateTime(2019, 10, 01),
                MissionEndDate = new DateTime(2019, 10, 01),
                MobilityRequired = true,
                OnSite = false,
                WorkFromHome = true,
                CustomerOfferStatusId = 1,
                Description = "Post Detail Description",
                CustomerAccountManagerId = 1,
                CustomerAccountManager = new User
                {
                    Id = 1,
                    Login = "sfoo",
                    Firstname = "Steve",
                    Lastname = "Foo",
                    Email = "steve.foo@capgemini.com",
                    ServiceLine = new ServiceLine
                    {
                        Id = 2,
                        Name = "DTC",
                        Description = "Digital Technology and Cloud"
                    },
                    Agency = new Agency
                    {
                        Id = 2,
                        Name = "Grimaud",
                        PostalCode = "83310"
                    }
                },
                CustomerOfferStatus = new CustomerOfferStatus
                {
                    Id = 1,
                    Code = "OPEN",
                    Description = "Open"
                },
                CustomerSite = new CustomerSite
                {
                    Id = 1,
                    Name = "Nice Sophia Antipolis",
                    CustomerId = 1,
                    Address = "address sophia Cedex 06421",
                    Contact = "+33 4 04 04 04 04",
                    Customer = new Customer
                    {
                        Id = 1,
                        Name = "Amadeus"
                    }
                },
                CustomerSiteId = 1,
                CustomerOfferSkills = new List<CustomerOfferSkill>()
            };

            // Assert
            customerOffer.Should()
                .NotBeNull()
                .And.BeEquivalentTo(
                    expectedCustomerOffer,
                    options => options.Excluding(toExclude => toExclude.RuntimeType == typeof(DateTime))
                );

            customerOffer.CreationDate.Should().BeCloseTo(expectedCustomerOffer.CreationDate, TimeSpan.FromMilliseconds(500));
        }
        
        [Fact]
        public void CreateCustomerOffer_ShouldThrow_CUSTOMEROFFER_MISSIONENDDATE_EARLIERTHAN_MISSIONSSTARTDATE_WhenTheGivenMissionEndDateIsEarlierThanTheGivenMissionStartDate()
        {
            // Act
            Action action = () =>
            {
                _customerOfferProvider.CreateCustomerOffer(
                    new Contracts.CustomerOffer
                    {
                        JobTitle = "FrontEnd Developer",
                        Requester = "Site Sophia Antipolis",
                        MissionStartDate = new DateTime(2019, 10, 01),
                        MissionEndDate = new DateTime(2019, 09, 01),
                        MobilityRequired = true,
                        OnSite = false,
                        WorkFromHome = true,
                        CustomerOfferStatusId = 1,
                        Description = "Post Detail Description",
                        CustomerAccountManagerId = 1,
                        CustomerSiteId = 1
                    });
            };
            
            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.CUSTOMEROFFER_MISSIONENDDATE_EARLIERTHAN_MISSIONSSTARTDATE);
        }
        
        [Fact]
        public void CreateCustomerOffer_ShouldThrow_ENTITY_NOTFOUND_WhenAWrongCustomerOfferStatusIdIsGiven()
        {
            // Act
            Action action = () =>
            {
                _customerOfferProvider.CreateCustomerOffer(
                    new Contracts.CustomerOffer
                    {
                        JobTitle = "FrontEnd Developer",
                        Requester = "Site Sophia Antipolis",
                        MissionStartDate = new DateTime(2019, 10, 01),
                        MissionEndDate = new DateTime(2019, 10, 01),
                        MobilityRequired = true,
                        OnSite = false,
                        WorkFromHome = true,
                        CustomerOfferStatusId = 8,
                        Description = "Post Detail Description",
                        CustomerAccountManagerId = 1,
                        CustomerSiteId = 1
                    });
            };
            
            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }
        
        [Fact]
        public void CreateCustomerOffer_ShouldThrow_ENTITY_NOTFOUND_WhenAWrongCustomerAccountManagerIdIsGiven()
        {
            // Act
            Action action = () =>
            {
                _customerOfferProvider.CreateCustomerOffer(
                    new Contracts.CustomerOffer
                    {
                        JobTitle = "FrontEnd Developer",
                        Requester = "Site Sophia Antipolis",
                        MissionStartDate = new DateTime(2019, 10, 01),
                        MissionEndDate = new DateTime(2019, 10, 01),
                        MobilityRequired = true,
                        OnSite = false,
                        WorkFromHome = true,
                        CustomerOfferStatusId = 1,
                        Description = "Post Detail Description",
                        CustomerAccountManagerId = 8,
                        CustomerSiteId = 1
                    });
            };
            
            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }
        
        [Fact]
        public void CreateCustomerOffer_ShouldThrow_ENTITY_NOTFOUND_WhenAWrongCustomerSiteIdIsGiven()
        {
            // Act
            Action action = () =>
            {
                _customerOfferProvider.CreateCustomerOffer(
                    new Contracts.CustomerOffer
                    {
                        JobTitle = "FrontEnd Developer",
                        Requester = "Site Sophia Antipolis",
                        MissionStartDate = new DateTime(2019, 10, 01),
                        MissionEndDate = new DateTime(2019, 10, 01),
                        MobilityRequired = true,
                        OnSite = false,
                        WorkFromHome = true,
                        CustomerOfferStatusId = 1,
                        Description = "Post Detail Description",
                        CustomerAccountManagerId = 1,
                        CustomerSiteId = 8
                    });
            };
            
            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void DeleteCustomerOffer_ShouldSuccessfullyDeleteTheCustomerOfferCorrespondingToTheGivenId()
        {
            // Act
            _customerOfferProvider.DeleteCustomerOffer(1);
            
            // Assert
            _knowledgeCenterContextMock.CustomerOffers.Count().Should().Be(0);
        }

        [Fact]
        public void DeleteCustomerOffer_ShouldThrow_ENTITY_NOTFOUND_Exception_WhenNoCustomerOfferFound()
        {
            // Act
            Action action = () => { _customerOfferProvider.DeleteCustomerOffer(9); };

            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }

        [Fact]
        public void UpdateCustomerOffer_ShouldThrow_ENTITY_NOTFOUND_WhenNoCustomerOfferIsFoundForTheGivenId()
        {
            // Act
            Action action = () => { _customerOfferProvider.UpdateCustomerOffer(9, new Contracts.CustomerOffer()); };
            
            // Assert
            action.Should().Throw<HandledException>()
                .And.ErrorCode.Should().Be(ErrorCode.ENTITY_NOTFOUND);
        }
        
        [Fact]
        public void
            UpdateCustomerOffer_ShouldSuccessfullyUpdateTheCustomerOfferCorrespondingToTheGivenId_WhenItDoesNotAlreadyExist()
        {
            // Act
            var customerOffer = _customerOfferProvider.UpdateCustomerOffer(1, new Contracts.CustomerOffer
            {
                Id = 1,
                JobTitle = "FrontEnd Developer",
                Requester = "Site Sophia Antipolis",
                CreationDate = new DateTime(2019, 08, 30),
                MissionStartDate = new DateTime(2019, 10, 01),
                MissionEndDate = new DateTime(2019, 10, 01),
                MobilityRequired = true,
                OnSite = false,
                WorkFromHome = true,
                Description = "Post Detail Description",
                CustomerOfferStatusId = 1,
                CustomerOfferStatus = new Contracts.CustomerOfferStatus {Id = 1, Code = "OPEN", Description = "Open"},
                CustomerAccountManagerId = 1,
                CustomerAccountManager = new Contracts.User
                {
                    Id = 1,
                    Login = "sfoo",
                    Firstname = "Steve",
                    Lastname = "Foo",
                    Email = "steve.foo@capgemini.com",
                    ServiceLine = new Contracts.ServiceLine {Id = 2, Name = "DTC", Description = "Digital Technology and Cloud"},
                    Agency = new Contracts.Agency {Id = 2, Name = "Grimaud", PostalCode = "83310"}
                },
                CustomerSite = new Contracts.CustomerSite
                {
                    Id = 1,
                    Name = "Nice Sophia Antipolis",
                    CustomerId = 1,
                    Address = "address sophia Cedex 06421",
                    Contact = "+33 4 04 04 04 04"
                },
                CustomerSiteId = 1,
                CustomerOfferSkills = new List<Contracts.CustomerOfferSkill>
                {
                    new Contracts.CustomerOfferSkill {Id = 1, SkillId = 1, SkillLevelId = 1, SkillPriority = 1}
                }
            });

            // Assert
            customerOffer.Should()
                .NotBeNull()
                .And.BeEquivalentTo(new CustomerOffer
                {
                    Id = 1,
                    JobTitle = "FrontEnd Developer",
                    Requester = "Site Sophia Antipolis",
                    CreationDate = new DateTime(2019, 08, 30),
                    MissionStartDate = new DateTime(2019, 10, 01),
                    MissionEndDate = new DateTime(2019, 10, 01),
                    MobilityRequired = true,
                    OnSite = false,
                    WorkFromHome = true,
                    CustomerOfferStatusId = 1,
                    Description = "Post Detail Description",
                    CustomerAccountManagerId = 1,
                    CustomerOfferStatus = new CustomerOfferStatus
                    {
                        Id = 1,
                        Code = "OPEN",
                        Description = "Open"
                    },
                    CustomerAccountManager = new User
                    {
                        Id = 1,
                        Login = "sfoo",
                        Firstname = "Steve",
                        Lastname = "Foo",
                        Email = "steve.foo@capgemini.com",
                        ServiceLine = new ServiceLine
                        {
                            Id = 2,
                            Name = "DTC",
                            Description = "Digital Technology and Cloud"
                        },
                        Agency = new Agency
                        {
                            Id = 2,
                            Name = "Grimaud",
                            PostalCode = "83310"
                        }
                    },
                    CustomerSite = new CustomerSite
                    {
                        Id = 1,
                        Name = "Nice Sophia Antipolis",
                        CustomerId = 1,
                        Address = "address sophia Cedex 06421",
                        Contact = "+33 4 04 04 04 04",
                        Customer = new Customer
                        {
                            Id = 1,
                            Name = "Amadeus"
                        }
                    },
                    CustomerSiteId = 1,
                    CustomerOfferSkills = new List<CustomerOfferSkill>
                    {
                        new CustomerOfferSkill
                        {
                            Id = 1,
                            SkillId = 1,
                            Skill = new Skill
                            {
                                Id = 1,
                                Name = "Agile",
                                ServiceLineId = 1,
                                ServiceLine = new ServiceLine
                                {
                                    Id = 1,
                                    Name = "Agile Center",
                                    Description = "Agile Center"
                                }
                            },
                            SkillLevelId = 1,
                            SkillLevel = new SkillLevel
                            {
                                Id = 1,
                                Name = "Novice"
                            },
                            SkillPriority = 1
                        }
                    }
                });
        }

        #endregion

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();

            var biotAgency = new DataConnector.Entities.Agency
            {
                Id = 1,
                Name = "Biot",
                PostalCode = "06410"
            };

            var grimaudAgency = new DataConnector.Entities.Agency
            {
                Id = 2,
                Name = "Grimaud",
                PostalCode = "83310"
            };

            var agileCenterServiceLine = new DataConnector.Entities.ServiceLine
            {
                Id = 1,
                Name = "Agile Center",
                Description = "Agile Center"
            };

            var dtcServiceLine = new DataConnector.Entities.ServiceLine
            {
                Id = 2,
                Name = "DTC",
                Description = "Digital Technology and Cloud"
            };

            var user = new DataConnector.Entities.User
            {
                Id = 1,
                Login = "sfoo",
                Firstname = "Steve",
                Lastname = "Foo",
                Email = "steve.foo@capgemini.com",
                ServiceLineId = dtcServiceLine.Id,
                AgencyId = grimaudAgency.Id
            };

            var openCustomerOfferStatus = new DataConnector.Entities.Match.CustomerOfferStatus
            {
                Id = 1,
                Code = "OPEN",
                Description = "Open"
            };

            var amadeusCustomer = new DataConnector.Entities.Match.Customer
            {
                Id = 1,
                Name = "Amadeus"
            };

            var koneCustomer = new DataConnector.Entities.Match.Customer
            {
                Id = 2,
                Name = "Kone"
            };

            var sophiaAntipolisCustomerSite = new DataConnector.Entities.Match.CustomerSite
            {
                Id = 1,
                Name = "Nice Sophia Antipolis",
                CustomerId = amadeusCustomer.Id,
                Address = "address sophia Cedex 06421",
                Contact = "+33 4 04 04 04 04"
            };

            var parisDefenseCustomerSite = new DataConnector.Entities.Match.CustomerSite
            {
                Id = 2,
                Name = "Paris Defense",
                CustomerId = koneCustomer.Id,
                Address = "Kone Paris Defense address",
                Contact = null
            };

            var noviceLevel = new DataConnector.Entities.Match.SkillLevel
            {
                Id = 1,
                Name = "Novice"
            };

            var expertLevel = new DataConnector.Entities.Match.SkillLevel
            {
                Id = 2,
                Name = "Expert"
            };

            var agileSkill = new DataConnector.Entities.Match.Skill
            {
                Id = 1,
                Name = "Agile",
                ServiceLineId = agileCenterServiceLine.Id
            };

            var scrumSkill = new DataConnector.Entities.Match.Skill
            {
                Id = 2,
                Name = "SCRUM",
                ServiceLineId = agileCenterServiceLine.Id
            };
            
            var collaboratorSkill = new DataConnector.Entities.Match.CollaboratorSkill
            {
                Id = 1,
                CollaboratorId = user.Id,
                SkillId = agileSkill.Id,
                SkillLevelId = noviceLevel.Id
            };

            var collaborator = new DataConnector.Entities.Match.Collaborator
            {
                Id = user.Id,
                GGID = 11111111,
                CollaboratorSkills = new List<DataConnector.Entities.Match.CollaboratorSkill> {collaboratorSkill}
            };

            var customerOfferSkill = new DataConnector.Entities.Match.CustomerOfferSkill
            {
                Id = 1,
                SkillId = agileSkill.Id,
                SkillLevelId = noviceLevel.Id,
                SkillPriority = 1
            };
            
            var customerOfferData = new DataConnector.Entities.Match.CustomerOffer
            {
                Id = 1,
                JobTitle = "FrontEnd Developer",
                Requester = "Site Sophia Antipolis",
                CreationDate = new DateTime(2019, 08, 30),
                MissionStartDate = new DateTime(2019, 10, 01),
                MissionEndDate = new DateTime(2020, 10, 01),
                ModificationDate = new DateTime(2019, 08, 30),
                MobilityRequired = true,
                OnSite = false,
                WorkFromHome = true,
                CustomerOfferStatusId = openCustomerOfferStatus.Id,
                Description = "Post Detail Description",
                CustomerAccountManagerId = user.Id,
                CustomerOfferStatus = openCustomerOfferStatus,
                CustomerAccountManager = user,
                CustomerSite = sophiaAntipolisCustomerSite,
                CustomerSiteId = sophiaAntipolisCustomerSite.Id,
                CustomerOfferSkills = new List<DataConnector.Entities.Match.CustomerOfferSkill> {customerOfferSkill}
            };

            var matching = new DataConnector.Entities.Match.Matching
            {
                Id = 1,
                CustomerOfferId = customerOfferData.Id,
                CollaboratorId = collaborator.Id,
                CreationDate = DateTime.Now,
                Score = 100
            };
            
            var matchingScorePerSkill = new DataConnector.Entities.Match.MatchingScorePerSkill
            {
                Id = 1,
                MatchingId = matching.Id,
                SkillLevelId = collaboratorSkill.SkillLevelId,
                CustomerOfferSkillId = matching.CustomerOfferId,
                Score = 100
            };

            knowledgeCenterContextMock.Agencies.AddRange(biotAgency, grimaudAgency);
            knowledgeCenterContextMock.ServiceLines.AddRange(agileCenterServiceLine, dtcServiceLine);
            knowledgeCenterContextMock.Users.Add(user);
            knowledgeCenterContextMock.Skills.AddRange(agileSkill, scrumSkill);
            knowledgeCenterContextMock.SkillLevels.AddRange(noviceLevel, expertLevel);
            knowledgeCenterContextMock.Collaborators.Add(collaborator);
            knowledgeCenterContextMock.CollaboratorSkills.Add(collaboratorSkill);
            knowledgeCenterContextMock.Customers.AddRange(amadeusCustomer, koneCustomer);
            knowledgeCenterContextMock.CustomersSites.AddRange(sophiaAntipolisCustomerSite, parisDefenseCustomerSite);
            knowledgeCenterContextMock.CustomerOffersStatus.Add(openCustomerOfferStatus);
            knowledgeCenterContextMock.CustomerOffers.Add(customerOfferData);
            knowledgeCenterContextMock.CustomerOfferSkills.Add(customerOfferSkill);
            knowledgeCenterContextMock.Matching.Add(matching);
            knowledgeCenterContextMock.MatchingScoresPerSkill.Add(matchingScorePerSkill);

            knowledgeCenterContextMock.SaveChanges();
            return knowledgeCenterContextMock;
        }


        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}