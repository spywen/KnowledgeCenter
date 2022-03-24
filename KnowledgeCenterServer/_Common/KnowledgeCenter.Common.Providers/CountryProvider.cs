using AutoMapper;
using KnowledgeCenter.Common.Contracts;
using KnowledgeCenter.Common.Providers._Interfaces;
using KnowledgeCenter.DataConnector;
using System.Collections.Generic;
using System.Linq;

namespace KnowledgeCenter.Common.Providers
{
    public class CountryProvider : ICountryProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IMapper _mapper;

        public CountryProvider(
            KnowledgeCenterContext knowledgeCenterContext,
            IMapper mapper)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _mapper = mapper;
        }

        public List<Country> GetCountries()
        {
            return _knowledgeCenterContext.Countries
                .Select(x => _mapper.Map<Contracts.Country>(x))
                .OrderBy(x => x.Name)
                .ToList();
        }
    }
}
