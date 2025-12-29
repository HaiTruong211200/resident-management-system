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
        const data = await StatisticsService.getDashboardStatistics();
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
      { name: "Mầm non (0-5)", count: 0 },
      {
        name: "Học sinh (6-18)",
        count: statistics.ageDistribution["0-17"] || 0,
      },
      {
        name: "Thanh niên (19-35)",
        count: statistics.ageDistribution["18-30"] || 0,
      },
      {
        name: "Trung niên (36-60)",
        count:
          (statistics.ageDistribution["31-45"] || 0) +
          (statistics.ageDistribution["46-60"] || 0),
      },
      { name: "Cao tuổi (>60)", count: statistics.ageDistribution["60+"] || 0 },
    ];
  }, [statistics]);

  const feeData = useMemo<MonthlyCollection[]>(
    () => statistics?.monthlyCollection || [],
    [statistics]
  );

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

          {/* Charts Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Age Statistics Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6">
                Thống kê độ tuổi cư dân
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={ageChartData}
                  margin={{ bottom: 60, left: 0, right: 0, top: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Fee Comparison Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6">
                So sánh thu phí và thu quỹ trong 12 tháng
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={feeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="fees"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Thu phí"
                  />
                  <Line
                    type="monotone"
                    dataKey="funds"
                    stroke="#16a34a"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Thu quỹ"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
