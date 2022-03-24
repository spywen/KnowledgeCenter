using KnowledgeCenter.Common;
using KnowledgeCenter.Covid.Contracts;
namespace KnowledgeCenter.Covid.Providers.Interfaces
{
    public interface ICovidProvider
    {
        CovidStatsResponse GetStats(BasePaginationRequest<CovidStatsFilters> pagingParametersBase);
    }
}
