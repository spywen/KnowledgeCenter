using AutoMapper;
using KnowledgeCenter.CapLab.Contracts;
using KnowledgeCenter.CapLab.Providers._Interfaces;
using KnowledgeCenter.DataConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KnowledgeCenter.CapLab.Providers
{
    public class TagProvider : ITagProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;
        private readonly IMapper _mapper;

        public TagProvider(KnowledgeCenterContext knowledgeCenterContext, IMapper mapper)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
            _mapper = mapper;
        }


        public List<Tag> GetAllTags()
        {
            return _knowledgeCenterContext.Tags.Select(x => _mapper.Map<Tag>(x)).ToList();
        }
    }
}
