using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using KnowledgeCenter.Common.Contracts;
using KnowledgeCenter.Common.Exceptions;
using KnowledgeCenter.Common.Providers._Interfaces;
using KnowledgeCenter.DataConnector;
using Entities = KnowledgeCenter.DataConnector.Entities;

namespace KnowledgeCenter.Common.Providers
{
    public class ServiceLineProvider : IServiceLineProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IMapper _mapper;

        public ServiceLineProvider(KnowledgeCenterContext knowledgeCenterContext,
            IMapper mapper)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _mapper = mapper;
        }

        public ServiceLine CreateServiceLine(ServiceLine serviceLineFacade)
        {
            if (_knowledgeCenterContext.ServiceLines.Any(x => x.Name.ToUpper() == serviceLineFacade.Name.ToUpper()))
            {
                throw new HandledException(ErrorCode.SERVICELINE_ALREADYEXISTS);
            }
            var serviceLine = new Entities.ServiceLine
            {
                Name = serviceLineFacade.Name,
                Description = serviceLineFacade.Description
            };

            _knowledgeCenterContext.ServiceLines.Add(serviceLine);
            _knowledgeCenterContext.SaveChanges();

            return _mapper.Map<ServiceLine>(serviceLine);
        }

        public List<ServiceLine> GetAllServiceLines()
        {
            return _knowledgeCenterContext.ServiceLines
                .Select(x => _mapper.Map<ServiceLine>(x))
                .ToList();
        }

        public ServiceLine GetServiceLine(int serviceLineId)
        {
            var serviceLine = _knowledgeCenterContext.ServiceLines
                .Where(x => x.Id == serviceLineId)
                .Select(x => _mapper.Map<ServiceLine>(x)).SingleOrDefault();
            if (serviceLine == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }
            return serviceLine;
        }

        public ServiceLine UpdateServiceLine(int id, ServiceLine serviceLineFacade)
        {
            var serviceLine = _knowledgeCenterContext.ServiceLines.SingleOrDefault(x => x.Id == id);
            if (serviceLine == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            serviceLine.Name = serviceLineFacade.Name;
            serviceLine.Description = serviceLineFacade.Description;

            _knowledgeCenterContext.ServiceLines.Update(serviceLine);
            _knowledgeCenterContext.SaveChanges();
            return _mapper.Map<ServiceLine>(serviceLine);
        }

        public void DeleteServiceLine(int id)
        {
            var isUserLinkedToThisServiceLine = _knowledgeCenterContext.Users.Any(x => x.ServiceLineId.Equals(id));
            if (isUserLinkedToThisServiceLine)
            {
                throw new HandledException(ErrorCode.SERVICELINE_LINKEDWITHUSER);
            }
            var serviceLine = _knowledgeCenterContext.ServiceLines.SingleOrDefault(x => x.Id == id);

            if (serviceLine == null)
            {
                throw new HandledException(ErrorCode.ENTITY_NOTFOUND);
            }

            _knowledgeCenterContext.ServiceLines.Remove(serviceLine);
            _knowledgeCenterContext.SaveChanges();
        }
    }
}