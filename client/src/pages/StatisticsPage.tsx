import React, { useEffect, useState } from "react";
import { Home, Users, DollarSign, TrendingUp, Loader } from "lucide-react";
import { StatisticsService, DashboardStatistics } from "../services/statisticsService";

interface AgeChartData {
  name: string;
  count: number;
}

// Mock data khi API không khả dụng
const MOCK_STATISTICS: DashboardStatistics = {
  totalHouseholds: 3,
  totalResidents: 4,
  totalFees: 716000,
  totalFunds: 0,
  totalCollection: 716000,
  ageDistribution: {
    "0-17": 1,
    "18-30": 0,
    "31-45": 1,
    "46-60": 2,
    "60+": 0,
  },
  monthlyCollection: [
    { month: "T1", fees: 4000, funds: 2000, total: 6000 },
    { month: "T2", fees: 3000, funds: 1500, total: 4500 },
    { month: "T3", fees: 2000, funds: 1000, total: 3000 },
    { month: "T4", fees: 2780, funds: 1390, total: 4170 },
    { month: "T5", fees: 1890, funds: 945, total: 2835 },
    { month: "T6", fees: 2390, funds: 1195, total: 3585 },
    { month: "T7", fees: 3490, funds: 1745, total: 5235 },
    { month: "T8", fees: 4000, funds: 2000, total: 6000 },
    { month: "T9", fees: 3000, funds: 1500, total: 4500 },
    { month: "T10", fees: 2000, funds: 1000, total: 3000 },
    { month: "T11", fees: 2780, funds: 1390, total: 4170 },
    { month: "T12", fees: 1890, funds: 945, total: 2835 },
  ],
  recentTransactions: [],
};

export const StatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
  const [ageChartData, setAgeChartData] = useState<AgeChartData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await StatisticsService.getDashboardStatistics();
        setStatistics(data);

        // Transform age distribution: backend gives 0-17, 18-30, 31-45, 46-60, 60+
        // We need: 0-5, 6-18, 19-35, 36-60, >60
        // Approximate mapping (best effort with available buckets):
        if (data.ageDistribution) {
          const ageChartTransformed: AgeChartData[] = [
            { name: "Mầm non (0-5)", count: Math.round((data.ageDistribution["0-17"] || 0) * 0.3) }, // ~30% of 0-17
            { name: "Học sinh (6-18)", count: Math.round((data.ageDistribution["0-17"] || 0) * 0.7) }, // ~70% of 0-17
            { name: "Thanh niên (19-35)", count: (data.ageDistribution["18-30"] || 0) + Math.round((data.ageDistribution["31-45"] || 0) * 0.3) },
            { name: "Trung niên (36-60)", count: Math.round((data.ageDistribution["31-45"] || 0) * 0.7) + (data.ageDistribution["46-60"] || 0) },
            { name: "Cao tuổi (>60)", count: data.ageDistribution["60+"] || 0 },
          ];
          setAgeChartData(ageChartTransformed);
        }

        setError(null);
        setUseMockData(false);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        const message = err instanceof Error ? err.message : "Không thể tải dữ liệu thống kê";
        setError(message);
        setUseMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const stats = [
    {
      icon: Home,
      label: "Tổng hộ khẩu",
      value: statistics?.totalHouseholds || 0,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      icon: Users,
      label: "Tổng nhân khẩu",
      value: statistics?.totalResidents || 0,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      icon: DollarSign,
      label: "Tổng thu phí",
      value: formatCurrency(statistics?.totalFees || 0),
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      icon: TrendingUp,
      label: "Tổng thu quỹ",
      value: formatCurrency(statistics?.totalFunds || 0),
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Tổng quan</h1>
        <p className="text-slate-500 mt-1">Xem tổng quan các thông tin quan trọng</p>
        {error && (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-sm">
            Không lấy được dữ liệu thật: <span className="font-medium">{error}</span>
          </div>
        )}
        {useMockData && (
          <p className="text-amber-600 text-sm mt-2">
            ℹ️ Đang hiển thị dữ liệu mẫu (do không gọi được API)
          </p>
        )}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center min-h-96">
          <div className="flex flex-col items-center gap-4">
            <Loader size={48} className="text-blue-600 animate-spin" />
            <p className="text-slate-600 font-medium">Đang tải dữ liệu...</p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`${stat.bgColor} border ${stat.borderColor} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`p-3 rounded-xl bg-white border ${stat.borderColor}`}
                    >
                      <Icon size={24} className={stat.iconColor} />
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${stat.iconColor}`}>
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Age Distribution Chart - CSS-based to avoid overlay issues */}
          <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50/30 border border-purple-100 rounded-2xl p-6 shadow-sm mt-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6">
              Thống kê độ tuổi cư dân
            </h2>
            <div className="space-y-4">
              {ageChartData.map((item, index) => {
                const maxCount = 200;
                const percentage = Math.min((item.count / maxCount) * 100, 100);
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-40 text-sm font-medium text-slate-700 shrink-0">
                      {item.name}
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                        style={{ width: `${percentage}%` }}
                      >
                        {item.count > 0 && (
                          <span className="text-xs font-semibold text-white">
                            {item.count}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-16 text-right text-sm text-slate-500 shrink-0">
                      {percentage.toFixed(0)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Collection Comparison Chart - CSS-based line chart */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-red-50/30 border border-blue-100 rounded-2xl p-6 shadow-sm mt-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6">
              So sánh thu phí và thu quỹ theo tháng
            </h2>
            {statistics?.monthlyCollection && (() => {
              // Calculate dynamic max value from actual data
              const allValues = statistics.monthlyCollection.flatMap(item => [item.fees, item.funds]);
              const maxDataValue = Math.max(...allValues, 1); // Ensure at least 1 to avoid division by zero
              // Round up to nearest nice number for Y-axis
              const magnitude = Math.pow(10, Math.floor(Math.log10(maxDataValue)));
              const maxValue = Math.ceil(maxDataValue / magnitude) * magnitude;
              
              // Generate Y-axis labels (5 steps)
              const ySteps = 5;
              const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => {
                const value = (maxValue / ySteps) * (ySteps - i);
                return value;
              });

              return (
                <div className="relative h-80 px-12">
                  {/* Y-axis labels (in VND) */}
                  <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-slate-500 w-10 text-right">
                    {yLabels.map((val, idx) => (
                      <div key={idx}>
                        {val >= 1000000 
                          ? `${(val / 1000000).toFixed(0)}M`
                          : val >= 1000 
                          ? `${(val / 1000).toFixed(0)}K`
                          : val.toFixed(0)
                        }
                      </div>
                    ))}
                  </div>

                  {/* Chart area */}
                  <div className="ml-2 h-full relative border-l-2 border-b-2 border-slate-300">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pb-8">
                      {yLabels.map((_, i) => (
                        <div key={i} className="border-t border-slate-200" />
                      ))}
                    </div>

                    {/* SVG for line chart */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height: 'calc(100% - 2rem)' }}>
                      {(() => {
                        const width = 100; // percentage
                        const height = 100; // percentage
                        const points = statistics.monthlyCollection.length;
                        const stepX = width / (points - 1);

                        // Calculate points for fees line
                        const feesPoints = statistics.monthlyCollection.map((item, i) => {
                          const x = i * stepX;
                          const y = height - (item.fees / maxValue) * height;
                          return `${x},${y}`;
                        }).join(' ');

                        // Calculate points for funds line
                        const fundsPoints = statistics.monthlyCollection.map((item, i) => {
                          const x = i * stepX;
                          const y = height - (item.funds / maxValue) * height;
                          return `${x},${y}`;
                        }).join(' ');

                        return (
                          <g>
                            {/* Fees line (blue) */}
                            <polyline
                              points={feesPoints}
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="0.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              vectorEffect="non-scaling-stroke"
                            />
                            {/* Fees points */}
                            {statistics.monthlyCollection.map((item, i) => {
                              const x = i * stepX;
                              const y = height - (item.fees / maxValue) * height;
                              return (
                                <circle
                                  key={`fees-${i}`}
                                  cx={x}
                                  cy={y}
                                  r="0.8"
                                  fill="#3b82f6"
                                  stroke="white"
                                  strokeWidth="0.3"
                                />
                              );
                            })}

                            {/* Funds line (red) */}
                            <polyline
                              points={fundsPoints}
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="0.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              vectorEffect="non-scaling-stroke"
                            />
                            {/* Funds points */}
                            {statistics.monthlyCollection.map((item, i) => {
                              const x = i * stepX;
                              const y = height - (item.funds / maxValue) * height;
                              return (
                                <circle
                                  key={`funds-${i}`}
                                  cx={x}
                                  cy={y}
                                  r="0.8"
                                  fill="#ef4444"
                                  stroke="white"
                                  strokeWidth="0.3"
                                />
                              );
                            })}
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* X-axis labels */}
                  <div className="ml-2 mt-2 flex justify-between text-xs text-slate-500">
                    {statistics.monthlyCollection.map((item, index) => (
                      <div key={index} className="text-center">
                        {item.month}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Legend */}
            <div className="mt-6 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-blue-500"></div>
                <span className="text-sm text-slate-700">Thu phí</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-red-500"></div>
                <span className="text-sm text-slate-700">Thu quỹ</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              Đơn vị: VND (K = nghìn, M = triệu)
            </div>
          </div>
        </>
      )}
    </div>
  );
};
