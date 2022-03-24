using KnowledgeCenter.DataConnector.Entities.Common;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities.Covid
{
    [Table("Covid.Stats")]
    public class Stats
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int CountryId { get; set; }
        public Country Country { get; set; }
        public int Death { get; set; }
        public int Recovered { get; set; }
        public int Detected { get; set; }
    }
}
