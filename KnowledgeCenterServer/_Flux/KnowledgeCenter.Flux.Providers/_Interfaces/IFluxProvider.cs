using KnowledgeCenter.Common;
using KnowledgeCenter.Flux.Contracts;
using System.Collections.Generic;

namespace KnowledgeCenter.Flux.Providers._Interfaces
{
    public interface IFluxProvider
    {
        Publication CreatePublication(CreatePublication publicationFacade);

        void DeletePublication(int id);

        Publication LikePublication(int id, LikeCode likeCode);

        BasePaginationResponse<List<Publication>> GetPublications(BasePaginationRequest<PublicationFilter> query);
    }
}
