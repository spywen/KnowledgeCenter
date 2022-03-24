using AutoMapper;
using KnowledgeCenter.Common.Contracts;
using Entities = KnowledgeCenter.DataConnector.Entities;

namespace KnowledgeCenter.Common.Providers
{
    public class _Mappings : Profile
    {
        public _Mappings()
        {
            CreateMap<Entities.User, User>()
                .AfterMap((source, dest, opt) =>
                {
                    dest.HasBeenActivated = true;
                    if (!source.IsActive && !string.IsNullOrEmpty(source.ActivationToken))
                    {
                        dest.HasBeenActivated = false;
                    }
                });
            CreateMap<Entities.Agency, Agency>();
            CreateMap<Entities.ServiceLine, ServiceLine>();
            CreateMap<Entities.Role, Role>();
            CreateMap<Entities.Common.Country, Country>();
        }
    }
}