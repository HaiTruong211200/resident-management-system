import React, { useEffect, useState, useMemo } from "react";
import { Home, Users, DollarSign, TrendingUp, Loader } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  StatisticsService,
  DashboardStatistics,
  AgeDistribution,
  MonthlyCollection,
} from "../services/statisticsService";

interface AgeChartData {
  name: string;
  count: number;
}

export const StatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        // Always force refresh statistics when entering this page
        const data = await StatisticsService.getDashboardStatistics({
          force: true,
        });
        if (!mounted) return;
        setStatistics(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        if (!mounted) return;
        setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStatistics();
    return () => {
      mounted = false;
    };
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const stats = useMemo(
    () => [
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
    ],
    [statistics]
  );

  const ageChartData = useMemo<AgeChartData[]>(() => {
    if (!statistics?.ageDistribution) return [];
    return [
      { name: "Mầm non (0-5)", count: statistics.ageDistribution["0-5"] || 0 },
      {
        name: "Học sinh (6-18)",
        count: statistics.ageDistribution["6-18"] || 0,
      },
      {
        name: "Thanh niên (19-35)",
        count: statistics.ageDistribution["19-35"] || 0,
      },
      {
        name: "Trung niên (36-60)",
        count: statistics.ageDistribution["36-60"] || 0,
      },
      { name: "Cao tuổi (>60)", count: statistics.ageDistribution["60+"] || 0 },
    ];
  }, [statistics]);

  const feeData = useMemo<MonthlyCollection[]>(() => {
    if (!statistics) return [];

    // New server endpoint may return `monthlyAggregation` with shape { month: 'YYYY-MM', fees, funds, totalCollected }
    const src =
      (statistics as any).monthlyAggregation || statistics.monthlyCollection;
    if (!src || !Array.isArray(src)) return [];

    // Map to MonthlyCollection shape expected by the chart
    const mapped: MonthlyCollection[] = src.map((m: any) => ({
      month: m.month,
      fees: m.fees ?? m.totalFees ?? 0,
      funds: m.funds ?? m.totalFunds ?? 0,
      total: m.total ?? m.totalCollected ?? (m.fees ?? 0) + (m.funds ?? 0),
    }));

    // Ensure sorted by month ascending
    mapped.sort((a, b) => (a.month > b.month ? 1 : a.month < b.month ? -1 : 0));
    return mapped;
  }, [statistics]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Tổng quan</h1>
        <p className="text-slate-500 mt-1">
          Xem tổng quan các thông tin quan trọng
        </p>
        {error && (
          <div className="mt-2 flex items-center gap-3">
            <p className="text-rose-600 text-sm">⚠️ {error}</p>
            <button
              className="text-sm underline text-slate-600"
              onClick={() => {
                setError(null);
                setLoading(true);
                StatisticsService.getDashboardStatistics({ force: true })
                  .then((data) => setStatistics(data))
                  .catch((e) =>
                    setError(
                      "Không thể tải dữ liệu thống kê. Vui lòng thử lại sau."
                    )
                  )
                  .finally(() => setLoading(false));
              }}
            >
              Thử lại
            </button>
          </div>
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

          {/* Age Distribution Chart */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-8 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-8">
              Thống kê độ tuổi cư dân
            </h2>
            <div className="space-y-6">
              {ageChartData.map((item, index) => {
                const total = ageChartData.reduce((sum, d) => sum + d.count, 0);
                const percentage =
                  total > 0 ? Math.round((item.count / total) * 100) : 0;

                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-40 text-sm font-medium text-slate-700">
                      {item.name}
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1 bg-white rounded-full h-8 relative overflow-hidden shadow-sm">
                        <div
                          className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        >
                          {item.count > 0 && (
                            <span className="text-xs font-semibold text-white">
                              {item.count}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-12 text-right text-sm font-semibold text-slate-700">
                        {percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Collection Line Chart */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              So sánh tổng thu phí và tổng thu quỹ trong 12 tháng
            </h2>
            <div className="flex gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-green-500 rounded"></div>
                <span className="text-sm font-medium text-slate-700">
                  Tổng thu phí
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-orange-500 rounded"></div>
                <span className="text-sm font-medium text-slate-700">
                  Tổng thu quỹ
                </span>
              </div>
            </div>
            {feeData.length > 0 && (
              <div className="relative w-full" style={{ height: "400px" }}>
                <canvas
                  id="lineChart"
                  ref={(canvas) => {
                    if (!canvas || feeData.length === 0) return;

                    const ctx = canvas.getContext("2d");
                    if (!ctx) return;

                    // Set canvas size
                    canvas.width = canvas.offsetWidth;
                    canvas.height = canvas.offsetHeight;

                    // Chart dimensions
                    const padding = 60;
                    const chartWidth = canvas.width - padding * 2;
                    const chartHeight = canvas.height - padding * 2;

                    // Find max value
                    const maxValue = Math.max(
                      ...feeData.map((d) => Math.max(d.fees || 0, d.funds || 0))
                    );

                    // Helper functions
                    const getX = (index: number) =>
                      padding + (index / (feeData.length - 1)) * chartWidth;
                    const getY = (value: number) =>
                      canvas.height -
                      padding -
                      (value / maxValue) * chartHeight;

                    // Clear canvas with gradient background
                    const gradient = ctx.createLinearGradient(
                      0,
                      0,
                      0,
                      canvas.height
                    );
                    gradient.addColorStop(0, "#faf5f0");
                    gradient.addColorStop(1, "#fef3c7");
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Draw grid lines
                    ctx.strokeStyle = "#fde68a";
                    ctx.lineWidth = 1;
                    for (let i = 0; i <= 4; i++) {
                      const y = padding + (chartHeight / 4) * i;
                      ctx.beginPath();
                      ctx.moveTo(padding, y);
                      ctx.lineTo(canvas.width - padding, y);
                      ctx.stroke();
                    }

                    // Draw axes
                    ctx.strokeStyle = "#d97706";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(padding, padding);
                    ctx.lineTo(padding, canvas.height - padding);
                    ctx.lineTo(canvas.width - padding, canvas.height - padding);
                    ctx.stroke();

                    // Draw fees line
                    ctx.strokeStyle = "#22c55e";
                    ctx.lineWidth = 3;
                    ctx.lineJoin = "round";
                    ctx.lineCap = "round";
                    ctx.beginPath();
                    feeData.forEach((d, i) => {
                      const x = getX(i);
                      const y = getY(d.fees || 0);
                      if (i === 0) ctx.moveTo(x, y);
                      else ctx.lineTo(x, y);
                    });
                    ctx.stroke();

                    // Draw funds line
                    ctx.strokeStyle = "#f97316";
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    feeData.forEach((d, i) => {
                      const x = getX(i);
                      const y = getY(d.funds || 0);
                      if (i === 0) ctx.moveTo(x, y);
                      else ctx.lineTo(x, y);
                    });
                    ctx.stroke();

                    // Draw dots for fees
                    ctx.fillStyle = "#22c55e";
                    feeData.forEach((d, i) => {
                      ctx.beginPath();
                      ctx.arc(getX(i), getY(d.fees || 0), 5, 0, Math.PI * 2);
                      ctx.fill();
                    });

                    // Draw dots for funds
                    ctx.fillStyle = "#f97316";
                    feeData.forEach((d, i) => {
                      ctx.beginPath();
                      ctx.arc(getX(i), getY(d.funds || 0), 5, 0, Math.PI * 2);
                      ctx.fill();
                    });

                    // Draw X-axis labels
                    ctx.fillStyle = "#475569";
                    ctx.font = "12px sans-serif";
                    ctx.textAlign = "center";
                    feeData.forEach((d, i) => {
                      ctx.fillText(
                        d.month,
                        getX(i),
                        canvas.height - padding + 25
                      );
                    });

                    // Draw Y-axis labels
                    ctx.textAlign = "right";
                    for (let i = 0; i <= 4; i++) {
                      const value = (maxValue / 4) * i;
                      const y = canvas.height - padding - (chartHeight / 4) * i;
                      const label = (value / 1000).toFixed(0) + "K";
                      ctx.fillText(label, padding - 10, y + 4);
                    }
                  }}
                  className="w-full h-full"
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
