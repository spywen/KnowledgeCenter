using AutoMapper;
using KnowledgeCenter.Flux.Contracts;
using System.Collections.Generic;
using System.Linq;
using Entities = KnowledgeCenter.DataConnector.Entities;

namespace KnowledgeCenter.Flux.Providers
{
    public class _Mappings : Profile
    {
        public _Mappings()
        {
            CreateMap<Entities.User, User>();
            CreateMap<Entities.Flux.Publication, Publication>()
                .AfterMap((source, dest, context) =>
                {
                    if (source.IsAnonymous)
                    {
                        dest.User = null;
                    }
                    var currentUserId = int.Parse(context.Items["CurrentUserId"].ToString());
                    if (source.UserId == currentUserId)
                    {
                        dest.IsOwner = true;
                    }
                    dest.Likes = new Dictionary<string, int>();
                    if (source.LikeCollection?.Any() ?? false)
                    {
                        dest.UserLike = source.LikeCollection?.SingleOrDefault(x => x.UserId == currentUserId)?.LikeCode;
                        dest.Likes = source.LikeCollection
                            .GroupBy(x => x.LikeCode)
                            .ToDictionary(t => t.Key, t => t.Count());
                    }
                });
        }
    }
}