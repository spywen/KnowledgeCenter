using KnowledgeCenter.Common.Tools;
using KnowledgeCenter.Covid.Providers.Interfaces;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities.Covid;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;

namespace KnowledgeCenter.Covid.Providers
{
    public class CovidImportProvider : ICovidImportProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;

        public CovidImportProvider(KnowledgeCenterContext knowledgeCenterContext)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
        }

        public void ImportData()
        {
            var req = (HttpWebRequest)WebRequest.Create("https://www.data.gouv.fr/fr/datasets/r/a7596877-d7c3-4da6-99c1-2f52d418e881");
            using (var resp = req.GetResponse())
            {
                using (var stream = resp.GetResponseStream())
                {
                    JsonSerializer serializer = new JsonSerializer();
                    using (var sr = new StreamReader(stream))
                    using (var jsonTextReader = new JsonTextReader(sr))
                    {
                        var result = serializer.Deserialize<RootObject>(jsonTextReader);

                        var dbCountries = _knowledgeCenterContext.Countries.ToList();
                        var lastDay = _knowledgeCenterContext.CovidStats.Max(x => x.Date);
                        var now = SystemTime.UtcNow();
                        var dataToImport = result.PaysData.Where(x => x.Date.Date > lastDay.Date && x.Date.Date != now.Date);

                        var stats = dataToImport
                            .Where(x => dbCountries.Any(y => y.FR_Name == x.Pays))
                            .Select(x => new Stats { 
                                CountryId = dbCountries.Single(y => y.FR_Name == x.Pays).Id,
                                Date = x.Date,
                                Death = x.Deces,
                                Detected = x.Infection,
                                Recovered = x.Guerisons
                            }).ToList();

                        _knowledgeCenterContext.CovidStats.AddRange(stats);
                        _knowledgeCenterContext.SaveChanges();
                    }
                }
            }
        }
    }

    public class CountryObject
    {
        public int id { get; set; }
        public string name { get; set; }
        public string alpha2 { get; set; }
        public string alpha3 { get; set; }
    }

    public class GlobalData
    {
        public DateTime Date { get; set; }
        public int Infection { get; set; }
        public int Deces { get; set; }
        public int Guerisons { get; set; }
        public double TauxDeces { get; set; }
        public double TauxGuerison { get; set; }
        public double TauxInfection { get; set; }
    }

    public class PaysData
    {
        public DateTime Date { get; set; }
        public string Pays { get; set; }
        public int Infection { get; set; }
        public int Deces { get; set; }
        public int Guerisons { get; set; }
        public double TauxDeces { get; set; }
        public double TauxGuerison { get; set; }
        public double TauxInfection { get; set; }
    }

    public class RootObject
    {
        public string Source { get; set; }
        public string Information { get; set; }
        public string Utilisation { get; set; }
        public List<GlobalData> GlobalData { get; set; }
        public List<PaysData> PaysData { get; set; }
    }
}
