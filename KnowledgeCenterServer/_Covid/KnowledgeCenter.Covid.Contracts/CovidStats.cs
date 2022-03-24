using System;
using System.Collections.Generic;

namespace KnowledgeCenter.Covid.Contracts
{
    public class CovidStatsResponse
    {
        public DateTime LastDay { get; set; }

        public GlobalStats France { get; set; }
        public GlobalStats World { get; set; }

        public CovidStats Deaths { get; set; }
        public CovidStats Recovered { get; set; }
        public CovidStats Detected { get; set; }
    }

    public class GlobalStats
    {
        public int TotalDeaths { get; set; }
        public int DailyNewDeaths { get; set; }
        public decimal DailyDeathsVariation { get; set; }

        public int TotalRecovered { get; set; }
        public int DailyNewRecovered { get; set; }
        public decimal DailyRecoveredVariation { get; set; }

        public int TotalDetected { get; set; }
        public int DailyNewDetected { get; set; }
        public decimal DailyDetectedVariation { get; set; }
    }

    public class CovidStats
    {
        public ChartData ChartDataTotal { get; set; }
        public ChartData ChartDataPerDay { get; set; }
    }

    public class ChartData
    {
        public List<string> Labels { get; set; }
        public List<DataSet> DataSets { get; set; }
    }

    public class DataSet
    {
        public string Label { get; set; }
        public List<int> Data { get; set; }
    }
}
