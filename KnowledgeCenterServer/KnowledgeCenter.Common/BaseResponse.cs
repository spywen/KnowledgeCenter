using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Reflection;

namespace KnowledgeCenter.Common
{
    public class BaseResponse<T>
    {
        public BaseResponse() { }
        public BaseResponse(T data)
        {
            Data = data;
        }

        public string Version = Assembly.GetEntryAssembly().GetCustomAttribute<AssemblyInformationalVersionAttribute>().InformationalVersion;

        public T Data { get; set; }

        public List<Error> Errors { get; set; } = new List<Error>();

        public List<Warning> Warnings { get; set; } = new List<Warning>();

        public List<Info> Infos { get; set; } = new List<Info>();

        public void AddErrors(List<Error> errors) => Errors.AddRange(errors);
        public void AddError(Error error) => Errors.Add(error);
        public void AddError(string code, string description, Exception e)
        {
            Errors.Add(new Error
            {
                Code = code,
                Description = description,
                Exception = e
            });
        }

        public void AddWarnings(List<Warning> warnings) => Warnings.AddRange(warnings);
        public void AddWarning(Warning warning) => Warnings.Add(warning);
        public void AddWarning(string code, string description)
        {
            Warnings.Add(new Warning
            {
                Code = code,
                Description = description
            });
        }

        public void AddInfos(List<Info> infos) => Infos.AddRange(infos);
        public void AddInfo(Info info) => Infos.Add(info);
        public void AddInfo(string code, string description)
        {
            Infos.Add(new Info
            {
                Code = code,
                Description = description
            });
        }
    }

    public class Error : Message
    {
        [JsonIgnore]
        public Exception Exception { get; set; }

        public ModelStateDictionary ModelState { get; set; }

        public string ExceptionMessage
        {
            get
            {
                var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                if (environment == EnvironmentEnum.Production.ToString())
                {
                    return string.Empty;
                }
                return Exception.Message;
            }
        }

        public string ExceptionDetails
        {
            get
            {
                var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                if (environment == EnvironmentEnum.Production.ToString())
                {
                    return string.Empty;
                }
                return Exception.ToString();
            }
        }
    }

    public class Warning : Message
    {

    }

    public class Info : Message
    {

    }

    public class Message
    {
        public string Code { get; set; }

        public string Description { get; set; }
    }
}
