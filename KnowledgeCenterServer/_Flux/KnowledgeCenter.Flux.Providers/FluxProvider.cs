using AutoMapper;
using KnowledgeCenter.Common;
using KnowledgeCenter.Common._Interfaces;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common.Security;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.Flux.Contracts;
using KnowledgeCenter.Flux.Providers._Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Entities = KnowledgeCenter.DataConnector.Entities.Flux;

namespace KnowledgeCenter.Flux.Providers
{
    public class FluxProvider : IFluxProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IMapper _mapper;
        private readonly IIdentityProvider _identityProvider;

        public FluxProvider(KnowledgeCenterContext knowledgeCenterContext,
            IMapper mapper,
            IIdentityProvider identityProvider)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _mapper = mapper;
            _identityProvider = identityProvider;
        }

        public Publication CreatePublication(CreatePublication publicationFacade)
        {
            var connectedUser = _identityProvider.GetConnectedUserIdentity();
            var now = DateTime.UtcNow;
            var publication = new Entities.Publication
            {
                Message = publicationFacade.Message,
                CategoryCode = publicationFacade.CategoryCode.ToString(),
                CreationDate = now,
                ModificationDate = now,
                IsAnonymous = publicationFacade.IsAnonymous,
                UserId = connectedUser.Id
            };

            _knowledgeCenterContext.FluxPublications.Add(publication);
            _knowledgeCenterContext.SaveChanges();

            return _mapper.Map<Publication>(GetPublicationEntity(publication.Id), opt => opt.Items["CurrentUserId"] = connectedUser.Id);
        }

        public void DeletePublication(int id)
        {
            var publication = GetPublicationEntity(id);
            var connectedUser = _identityProvider.GetConnectedUserIdentity();
            if (connectedUser.Id != publication.UserId && !connectedUser.HasRole(EnumRoles.FLUX_ADMIN))
            {
                throw new HandledException(ErrorCode.UNAUTHORIZED_OPERATION);
            }

            _knowledgeCenterContext.FluxPublications.Remove(publication);
            _knowledgeCenterContext.SaveChanges();
        }

        public Publication LikePublication(int id, LikeCode likeCode)
        {
            var connectedUser = _identityProvider.GetConnectedUserIdentity();
            var publicationUserLike = _knowledgeCenterContext.FluxLikes
                .SingleOrDefault(x => x.UserId == connectedUser.Id && x.PublicationId == id);

            if (publicationUserLike == null)
            {
                var like = new Entities.Like
                {
                    PublicationId = id,
                    LikeCode = likeCode.ToString(),
                    CreationDate = DateTime.UtcNow,
                    UserId = connectedUser.Id
                };
                _knowledgeCenterContext.FluxLikes.Add(like);
            }
            else
            {
                if (publicationUserLike.LikeCode == likeCode.ToString())
                {
                    _knowledgeCenterContext.FluxLikes.Remove(publicationUserLike);
                }
                else
                {
                    publicationUserLike.LikeCode = likeCode.ToString();
                    _knowledgeCenterContext.FluxLikes.Update(publicationUserLike);
                }
            }

            _knowledgeCenterContext.SaveChanges();
            return _mapper.Map<Publication>(GetPublicationEntity(id), opt => opt.Items["CurrentUserId"] = connectedUser.Id);
        }

        public BasePaginationResponse<List<Publication>> GetPublications(BasePaginationRequest<PublicationFilter> query)
        {
            var publicationsQuery = _knowledgeCenterContext.FluxPublications
                .Include(x => x.User)
                .Include(x => x.LikeCollection)
                .AsQueryable();

            var connectedUserId = _identityProvider.GetConnectedUserIdentity().Id;

            publicationsQuery = publicationsQuery
                .OrderByDescending(x => x.CreationDate);

            var totalItems = publicationsQuery.Count();
            var publications = publicationsQuery
                .Skip(query.Size * (query.Page - 1))
                .Take(query.Size)
                .ToList();

            return new BasePaginationResponse<List<Publication>>(_mapper.Map<List<Publication>>(publications, opt => opt.Items["CurrentUserId"] = connectedUserId), query, totalItems);
        }

        private Entities.Publication GetPublicationEntity(int id)
        {
            if (!_knowledgeCenterContext.FluxPublications.Any(x => x.Id == id))
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }
            return _knowledgeCenterContext.FluxPublications
                .Include(x => x.User)
                .Include(x => x.LikeCollection)
                .Single(x => x.Id == id);
        }
    }
}
