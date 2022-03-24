using KnowledgeCenter.Common;
using KnowledgeCenter.Covid.Contracts;
using KnowledgeCenter.Covid.Providers.Interfaces;
using KnowledgeCenter.DataConnector;
using KnowledgeCenter.DataConnector.Entities.Common;
using KnowledgeCenter.DataConnector.Entities.Covid;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace KnowledgeCenter.Covid.Providers
{
    public class CovidProvider : ICovidProvider
    {
        private readonly KnowledgeCenterContext _knowledgeCenterContext;

        public CovidProvider(KnowledgeCenterContext knowledgeCenterContext)
        {
            _knowledgeCenterContext = knowledgeCenterContext;
        }

        public CovidStatsResponse GetStats(BasePaginationRequest<CovidStatsFilters> pagingParametersBase)
        {
            var startDate = new DateTime(2020, 1, 22);
            var endDate = _knowledgeCenterContext.CovidStats.Max(x => x.Date);

            if (!pagingParametersBase.Filters.CountryCodes?.Any() ?? true)
            {
                pagingParametersBase.Filters.CountryCodes = new List<string> { 
                    EnumCountryCodes.FR,
                    EnumCountryCodes.IT,
                    EnumCountryCodes.ES,
                    EnumCountryCodes.CN,
                }.ToArray();
            } 
            else if (pagingParametersBase.Filters.CountryCodes.Count() > 10)
            {
                pagingParametersBase.Filters.CountryCodes = pagingParametersBase.Filters.CountryCodes.Take(10).ToArray();
            }

            var countryIds = _knowledgeCenterContext.Countries
                .Where(x => pagingParametersBase.Filters.CountryCodes.Contains(x.Code))
                .Select(x => x.Id).ToList();

            var filteredStats = _knowledgeCenterContext.CovidStats
                .Include(x => x.Country)
                .Where(x => countryIds.Contains(x.CountryId)
                    && x.Date >= startDate
                    && x.Date <= endDate)
                .OrderByDescending(x => x.Date)
                .ToList();

            var statsPerCountry = filteredStats
                .GroupBy(x => x.CountryId)
                .Select(x => new TempStats
                {
                    Stats = x,
                    Country = x.Select(y => y.Country.Name).First()
                })
                .OrderBy(x => x.Country)
                .ToList();

            var response = new CovidStatsResponse
            {
                LastDay = endDate,
                Deaths = GetDeaths(statsPerCountry, startDate, endDate),
                Recovered = GetRecovered(statsPerCountry, startDate, endDate),
                Detected = GetDetected(statsPerCountry, startDate, endDate),
            };

            var france = _knowledgeCenterContext.Countries.Single(x => x.Code == EnumCountryCodes.FR);
            var franceStats = _knowledgeCenterContext.CovidStats.Where(x => x.CountryId == france.Id && (x.Date == endDate || x.Date == endDate.AddDays(-1) || x.Date == endDate.AddDays(-2))).ToList();
            var franceToday = franceStats.Single(x => x.Date == endDate);
            var franceYesterday = franceStats.Single(x => x.Date == endDate.AddDays(-1));
            var franceTwoDaysAgo = franceStats.Single(x => x.Date == endDate.AddDays(-2));
            response.France = new GlobalStats {
                TotalDeaths = franceToday?.Death ?? 0,
                DailyNewDeaths = (franceToday?.Death ?? 0) - (franceYesterday?.Death ?? 0),
                DailyDeathsVariation = (franceYesterday.Death - franceTwoDaysAgo.Death == 0) ? 0 : Math.Round(((100 * ((decimal)franceToday.Death - franceYesterday.Death)) / (franceYesterday.Death - franceTwoDaysAgo.Death)), 2) - 100,

                TotalRecovered = franceToday?.Recovered ?? 0,
                DailyNewRecovered = (franceToday?.Recovered ?? 0) - (franceYesterday?.Recovered ?? 0),
                DailyRecoveredVariation = (franceYesterday.Recovered - franceTwoDaysAgo.Recovered == 0) ? 0 : Math.Round(((100 * ((decimal)franceToday.Recovered - franceYesterday.Recovered)) / (franceYesterday.Recovered - franceTwoDaysAgo.Recovered)), 2) - 100,

                TotalDetected = franceToday?.Detected ?? 0,
                DailyNewDetected = (franceToday?.Detected ?? 0) - (franceYesterday?.Detected ?? 0),
                DailyDetectedVariation = (franceYesterday.Detected - franceTwoDaysAgo.Detected == 0) ? 0 : Math.Round(((100 * ((decimal)franceToday.Detected - franceYesterday.Detected)) / (franceYesterday.Detected - franceTwoDaysAgo.Detected)), 2) - 100
            };

            var worldStatsToday = _knowledgeCenterContext.CovidStats.Where(x => x.Date == endDate);
            var worldDeathsToday = worldStatsToday.Sum(x => x.Death);
            var worldRecoveredToday = worldStatsToday.Sum(x => x.Recovered);
            var worldDetectedToday = worldStatsToday.Sum(x => x.Detected);

            var worldStatsYesterday = _knowledgeCenterContext.CovidStats.Where(x => x.Date == endDate.AddDays(-1));
            var worldDeathsYesterday = worldStatsYesterday.Sum(x => x.Death);
            var worldRecoveredYesterday = worldStatsYesterday.Sum(x => x.Recovered);
            var worldDetectedYesterday = worldStatsYesterday.Sum(x => x.Detected);

            var worldStatsTwoDaysAgo = _knowledgeCenterContext.CovidStats.Where(x => x.Date == endDate.AddDays(-2));
            var worldDeathsTwoDaysAgo = worldStatsTwoDaysAgo.Sum(x => x.Death);
            var worldRecoveredTwoDaysAgo = worldStatsTwoDaysAgo.Sum(x => x.Recovered);
            var worldDetectedTwoDaysAgo = worldStatsTwoDaysAgo.Sum(x => x.Detected);
            response.World = new GlobalStats
            {
                TotalDeaths = worldDeathsToday,
                DailyNewDeaths = worldDeathsToday - worldDeathsYesterday,
                DailyDeathsVariation = (worldDeathsYesterday - worldDeathsTwoDaysAgo == 0) ? 0 : Math.Round(((100 * ((decimal)worldDeathsToday - worldDeathsYesterday)) / (worldDeathsYesterday - worldDeathsTwoDaysAgo)), 2) - 100,

                TotalRecovered = worldRecoveredToday,
                DailyNewRecovered = worldRecoveredToday - worldRecoveredYesterday,
                DailyRecoveredVariation = (worldRecoveredYesterday - worldRecoveredTwoDaysAgo == 0) ? 0 : Math.Round(((100 * ((decimal)worldRecoveredToday - worldRecoveredYesterday)) / (worldRecoveredYesterday - worldRecoveredTwoDaysAgo)), 2) - 100,

                TotalDetected = worldDetectedToday,
                DailyNewDetected = worldDetectedToday - worldDetectedYesterday,
                DailyDetectedVariation = (worldDetectedYesterday - worldDetectedTwoDaysAgo == 0) ? 0 : Math.Round(((100 * ((decimal)worldDetectedToday - worldDetectedYesterday)) / (worldDetectedYesterday - worldDetectedTwoDaysAgo)), 2) - 100,
            };

            return response;
        }

        private CovidStats GetDeaths(List<TempStats> statsPerCountry, DateTime startDate, DateTime endDate)
        {
            var covidStats = new CovidStats();

            var dataSetsTotal = new List<DataSet>();
            var dataSetsPerDay = new List<DataSet>();
            statsPerCountry.ForEach(statForOneCountry =>
            {
                var dataSetTotal = new DataSet
                {
                    Label = $"{statForOneCountry.Country}"
                };
                var dataSetPerDay = new DataSet
                {
                    Label = $"{statForOneCountry.Country}"
                };
                var currentDateTreated = startDate;
                var dataTotal = new List<int>();
                var dataPerDay = new List<int>();
                while (currentDateTreated <= endDate)
                {
                    var currentDayStats = statForOneCountry.Stats.SingleOrDefault(x => x.Date.Day == currentDateTreated.Day && x.Date.Month == currentDateTreated.Month && x.Date.Year == currentDateTreated.Year);
                    dataTotal.Add(currentDayStats?.Death ?? 0);

                    var yesterdayDateTreated = currentDateTreated.AddDays(-1);
                    var yesterdayStats = statForOneCountry.Stats.SingleOrDefault(x => x.Date.Day == yesterdayDateTreated.Day && x.Date.Month == yesterdayDateTreated.Month && x.Date.Year == yesterdayDateTreated.Year);
                    var diff = (currentDayStats?.Death ?? 0) - (yesterdayStats?.Death ?? 0);
                    dataPerDay.Add(diff < 0 ? 0 : diff);

                    currentDateTreated = currentDateTreated.AddDays(1);
                }
                dataSetTotal.Data = dataTotal;
                dataSetsTotal.Add(dataSetTotal);
                dataSetPerDay.Data = dataPerDay;
                dataSetsPerDay.Add(dataSetPerDay);
            });

            covidStats.ChartDataTotal = new ChartData
            {
                Labels = DaysBetween(startDate, endDate).ToList(),
                DataSets = dataSetsTotal
            };
            covidStats.ChartDataPerDay = new ChartData
            {
                Labels = DaysBetween(startDate, endDate).ToList(),
                DataSets = dataSetsPerDay
            };

            return covidStats;
        }

        private CovidStats GetRecovered(List<TempStats> statsPerCountry, DateTime startDate, DateTime endDate)
        {
            var covidStats = new CovidStats();

            var dataSetsTotal = new List<DataSet>();
            var dataSetsPerDay = new List<DataSet>();
            statsPerCountry.ForEach(statForOneCountry =>
            {
                var dataSetTotal = new DataSet
                {
                    Label = $"{statForOneCountry.Country}"
                };
                var dataSetPerDay = new DataSet
                {
                    Label = $"{statForOneCountry.Country}"
                };
                var currentDateTreated = startDate;
                var dataTotal = new List<int>();
                var dataPerDay = new List<int>();
                while (currentDateTreated <= endDate)
                {
                    var currentDayStats = statForOneCountry.Stats.SingleOrDefault(x => x.Date.Day == currentDateTreated.Day && x.Date.Month == currentDateTreated.Month && x.Date.Year == currentDateTreated.Year);
                    dataTotal.Add(currentDayStats?.Recovered ?? 0);

                    var yesterdayDateTreated = currentDateTreated.AddDays(-1);
                    var yesterdayStats = statForOneCountry.Stats.SingleOrDefault(x => x.Date.Day == yesterdayDateTreated.Day && x.Date.Month == yesterdayDateTreated.Month && x.Date.Year == yesterdayDateTreated.Year);
                    var diff = (currentDayStats?.Recovered ?? 0) - (yesterdayStats?.Recovered ?? 0);
                    dataPerDay.Add(diff < 0 ? 0 : diff);

                    currentDateTreated = currentDateTreated.AddDays(1);
                }
                dataSetTotal.Data = dataTotal;
                dataSetsTotal.Add(dataSetTotal);
                dataSetPerDay.Data = dataPerDay;
                dataSetsPerDay.Add(dataSetPerDay);
            });

            covidStats.ChartDataTotal = new ChartData
            {
                Labels = DaysBetween(startDate, endDate).ToList(),
                DataSets = dataSetsTotal
            };
            covidStats.ChartDataPerDay = new ChartData
            {
                Labels = DaysBetween(startDate, endDate).ToList(),
                DataSets = dataSetsPerDay
            };

            return covidStats;
        }

        private CovidStats GetDetected(List<TempStats> statsPerCountry, DateTime startDate, DateTime endDate)
        {
            var covidStats = new CovidStats();

            var dataSetsTotal = new List<DataSet>();
            var dataSetsPerDay = new List<DataSet>();
            statsPerCountry.ForEach(statForOneCountry =>
            {
                var dataSetTotal = new DataSet
                {
                    Label = $"{statForOneCountry.Country}"
                };
                var dataSetPerDay = new DataSet
                {
                    Label = $"{statForOneCountry.Country}"
                };
                var currentDateTreated = startDate;
                var dataTotal = new List<int>();
                var dataPerDay = new List<int>();
                while (currentDateTreated <= endDate)
                {
                    var currentDayStats = statForOneCountry.Stats.SingleOrDefault(x => x.Date.Day == currentDateTreated.Day && x.Date.Month == currentDateTreated.Month && x.Date.Year == currentDateTreated.Year);
                    dataTotal.Add(currentDayStats?.Detected ?? 0);

                    var yesterdayDateTreated = currentDateTreated.AddDays(-1);
                    var yesterdayStats = statForOneCountry.Stats.SingleOrDefault(x => x.Date.Day == yesterdayDateTreated.Day && x.Date.Month == yesterdayDateTreated.Month && x.Date.Year == yesterdayDateTreated.Year);
                    var diff = (currentDayStats?.Detected ?? 0) - (yesterdayStats?.Detected ?? 0);
                    dataPerDay.Add(diff < 0 ? 0 : diff);

                    currentDateTreated = currentDateTreated.AddDays(1);
                }
                dataSetTotal.Data = dataTotal;
                dataSetsTotal.Add(dataSetTotal);
                dataSetPerDay.Data = dataPerDay;
                dataSetsPerDay.Add(dataSetPerDay);
            });

            covidStats.ChartDataTotal = new ChartData
            {
                Labels = DaysBetween(startDate, endDate).ToList(),
                DataSets = dataSetsTotal
            };
            covidStats.ChartDataPerDay = new ChartData
            {
                Labels = DaysBetween(startDate, endDate).ToList(),
                DataSets = dataSetsPerDay
            };

            return covidStats;
        }

        private IEnumerable<string> DaysBetween(DateTime startDate, DateTime endDate)
        {
            DateTime iterator = startDate;

            while (iterator <= endDate)
            {
                yield return iterator.ToString("dd/MM/yyyy");
                iterator = iterator.AddDays(1);
            }
        }
    }

    public class TempStats
    {
        public string Country { get; set; }
        public IGrouping<int, Stats> Stats { get; set; }
    }
}
