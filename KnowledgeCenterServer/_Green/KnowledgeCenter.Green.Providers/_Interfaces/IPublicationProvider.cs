using KnowledgeCenter.Green.Contracts;
using KnowledgeCenter.Common;
using System.Collections.Generic;

namespace KnowledgeCenter.Green.Providers._Interfaces
{
    public interface IPublicationProvider
    {
        Publication GetLastPublication();

        Publication GetPublication(int id);

        void DeletePublication(int id);

        Publication CreatePublication(CreateOrUpdatePublication publicationFacade);

        Publication UpdatePublication(CreateOrUpdatePublication publicationFacade);

        List<Publication> GetAllPublications();

        List<PublicationType> GetAllPublicationTypes();
    }
}