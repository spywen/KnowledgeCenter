using FluentAssertions;
using KnowledgeCenter.Common.Providers.Tests.Helpers;
using KnowledgeCenter.DataConnector;
using System.Linq;
using Xunit;

namespace KnowledgeCenter.Common.Providers.Tests
{
    public class CountryProviderTests : _BaseTests
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContextMock;

        private readonly CountryProvider _countryProvider;

        public CountryProviderTests()
        {
            _knowledgeCenterContextMock = InitializeDbContext();

            _countryProvider = new CountryProvider(_knowledgeCenterContextMock, MapperWithoutMock);
        }

        [Fact]
        public void GetCountries_ShouldReturnAllCountries()
        {
            // Act
            var result = _countryProvider.GetCountries();

            // Assert
            result.Count.Should().Be(1);
            result.First().Id.Should().Be(1);
            result.First().Code.Should().Be("fr");
            result.First().Name.Should().Be("France");
        }

        private KnowledgeCenterContext InitializeDbContext()
        {
            var knowledgeCenterContextMock = GetDbContextMock();

            knowledgeCenterContextMock.Countries.Add(new DataConnector.Entities.Common.Country
            {
                Id = 1,
                Code = "fr",
                Name = "France"
            });

            knowledgeCenterContextMock.SaveChanges();

            return knowledgeCenterContextMock;
        }

        public override void Dispose()
        {
            _knowledgeCenterContextMock.Dispose();
        }
    }
}
