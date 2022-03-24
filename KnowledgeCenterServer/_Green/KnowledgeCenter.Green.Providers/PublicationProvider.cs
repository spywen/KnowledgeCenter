using AutoMapper;
using KnowledgeCenter.Common._Interfaces;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common.Tools;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.Green.Contracts;
using KnowledgeCenter.Green.Providers._Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Entities = KnowledgeCenter.DataConnector.Entities.Green;

namespace KnowledgeCenter.Green.Providers
{
    public class PublicationProvider : IPublicationProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IMapper _mapper;
        private readonly IIdentityProvider _identityProvider;

        public PublicationProvider(KnowledgeCenterContext knowledgeCenterContext,
            IMapper mapper,
            IIdentityProvider identityProvider)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _mapper = mapper;
            _identityProvider = identityProvider;
        }

        public Publication GetLastPublication()
        {
            var entity = _knowledgeCenterContext.Publications?
                .OrderByDescending(x => x.PublicationDate)
                .FirstOrDefault(x => DateTime.Compare(x.PublicationDate, SystemTime.UtcNow()) <= 0);
            if (entity == null)
            {
                return null;
            }
            return _mapper.Map<Publication>(entity);
        }

        public Publication GetPublication(int id)
        {
            return _mapper.Map<Publication>(GetPublicationEntity(id));
        }

        public void DeletePublication(int id)
        {
            var publication = GetPublicationEntity(id);
            _knowledgeCenterContext.Publications.Remove(publication);
            _knowledgeCenterContext.SaveChanges();
        }

        public Publication CreatePublication(CreateOrUpdatePublication publicationFacade)
        {
            var connectedUserId = _identityProvider.GetConnectedUserIdentity().Id;
            var connectedUser = _identityProvider.GetConnectedUserIdentity();
            var now = SystemTime.UtcNow();
            var publication = new Entities.Publication
            {
                Message = publicationFacade.Message,
                UserId = connectedUserId,
                CreationDate = now,
                ModificationDate = now,
                PublicationDate = publicationFacade.PublicationDate,
                PublicationTypeId = publicationFacade.PublicationTypeId
            };

            _knowledgeCenterContext.Publications.Add(publication);
            _knowledgeCenterContext.SaveChanges();
            return GetPublication(publication.Id);
        }

        public Publication UpdatePublication(CreateOrUpdatePublication publicationFacade)
        {
            var publication = GetPublicationEntity(publicationFacade.Id);

            publication.ModificationDate = SystemTime.UtcNow();
            publication.PublicationDate = publicationFacade.PublicationDate;
            publication.Message = publicationFacade.Message;
            publication.PublicationTypeId = publicationFacade.PublicationTypeId;

            _knowledgeCenterContext.Publications.Update(publication);
            _knowledgeCenterContext.SaveChanges();

            return GetPublication(publication.Id);
        }

        public List<Publication> GetAllPublications()
        {
            var publications = _knowledgeCenterContext.Publications
                .Include(x => x.PublicationType)
                .Include(x => x.User)
                .OrderByDescending(x => x.PublicationDate).ToList();

            var latestPublication = GetLastPublication();

            return _mapper.Map<List<Publication>>(publications, opt => opt.Items["LastPublicationId"] = latestPublication?.Id);
        }

        public List<PublicationType> GetAllPublicationTypes()
        {
            return _mapper.Map<List<PublicationType>>(_knowledgeCenterContext.PublicationTypes.ToList());
        }

        private Entities.Publication GetPublicationEntity(int id)
        {
            if (!_knowledgeCenterContext.Publications.Any(x => x.Id == id))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }
            return _knowledgeCenterContext.Publications
                .Include(x => x.User)
                .Single(x => x.Id == id);
        }
    }
}
