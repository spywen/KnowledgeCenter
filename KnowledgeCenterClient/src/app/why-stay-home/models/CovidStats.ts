export interface CovidStatsResponse {
  lastDay: Date;
  france: GlobalStats;
  world: GlobalStats;
  deaths: CovidStats;
  recovered: CovidStats;
  detected: CovidStats;
}

export interface GlobalStats {
  totalDeaths: number;
  dailyNewDeaths: number;
  dailyDeathsVariation: number;

  totalRecovered: number;
  dailyNewRecovered: number;
  dailyRecoveredVariation: number;

  totalDetected: number;
  dailyNewDetected: number;
  dailyDetectedVariation: number;
}

export interface CovidStats {
  chartDataTotal: ChartData;
  chartDataPerDay: ChartData;
}

export interface ChartData {
  labels: Array<string>;
  dataSets: Array<DataSet>;
  total: number;
}

export interface DataSet {
  label: string;
  data: Array<number>;
}
