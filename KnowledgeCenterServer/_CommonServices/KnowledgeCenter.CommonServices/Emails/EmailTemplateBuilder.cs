using KnowledgeCenter.CommonServices._Interfaces;
using KnowledgeCenter.CommonServices.Contracts._Interfaces;
using RazorLight;
using System;
using System.IO;
using System.Reflection;

namespace KnowledgeCenter.CommonServices.Emails
{
    public class EmailTemplateBuilder : IEmailTemplateBuilder
    {
        public string GenerateEmail(IEmailModel model)
        {
            var engine = new RazorLightEngineBuilder()
              .UseFilesystemProject(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location))
              .UseMemoryCachingProvider()
              .Build();

            Type t = model.GetType();
            var modelName = t.Name;
            return engine.CompileRenderAsync($"Emails/Templates/{modelName.Replace("Model", "")}.cshtml", model).Result;
        }
    }
}
