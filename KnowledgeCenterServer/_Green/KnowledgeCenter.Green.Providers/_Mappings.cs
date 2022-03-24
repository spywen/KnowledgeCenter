using AutoMapper;
using KnowledgeCenter.Green.Contracts;
using System.Linq;
using Entities = KnowledgeCenter.DataConnector.Entities;

namespace KnowledgeCenter.Green.Providers
{
    public class _Mappings : Profile
    {
        public _Mappings()
        {
            CreateMap<Entities.User, User>();
            CreateMap<Entities.Green.PublicationType, PublicationType>();

            CreateMap<Entities.Green.Publication, Publication>()
                .AfterMap((source, dest, context) =>
                {
                    if (context.Items.Any(x => x.Key == "LastPublicationId"))
                    {
                        var lastPublicationId = int.Parse(context.Items["LastPublicationId"].ToString());
                        if (source.Id == lastPublicationId)
                        {
                            dest.IsPublished = true;
                        }
                    }
                });
        }
    }
}