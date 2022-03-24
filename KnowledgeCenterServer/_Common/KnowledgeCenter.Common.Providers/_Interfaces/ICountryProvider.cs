using KnowledgeCenter.Common.Contracts;
using System.Collections.Generic;

namespace KnowledgeCenter.Common.Providers._Interfaces
{
    public interface ICountryProvider
    {
        List<Country> GetCountries();
    }
}
