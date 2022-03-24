using System.Collections.Generic;
using KnowledgeCenter.Common;
using KnowledgeCenter.Match.Contracts;

namespace KnowledgeCenter.Match.Providers._Interfaces
{
    public interface IMatchingProvider
    {
        BasePaginationResponse<List<Matching>> GetFilteredMatching(BasePaginationRequest<MatchingFilter> query);
        Matching GetMatching(int matchingId);
        List<Matching> GenerateMatching(int customerOfferId);
        void DeleteMatching(int customerOfferId);
    }
}