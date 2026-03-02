/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  DocumentChartBarIcon,
  BriefcaseIcon,
  ArrowTrendingUpIcon,
  AcademicCapIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Activity } from "@/types/activity";
import { Publication } from "@/types/publication"; // Assuming types import

// Define types locally if not yet available in global types, or assume they are passed correctly
interface OverviewTabProps {
  stats: {
    totalProjects: number;
    totalFunding: number;
    activeMembers: number;
    publications: number;
    openOpportunities: number;
  };
  recruitmentData: any[];
  publicationsData: any[];
  fundingSourceData: any[];
  allPublications: Publication[];
  latestPublications: Publication[];
  recentActivities: Activity[];
  allApplications?: any[];
  allProjects?: any[];
}

export default function OverviewTab({
  stats,
  recruitmentData,
  publicationsData, // This is pre-aggregated year data, still useful for initial view
  fundingSourceData,
  latestPublications,
  recentActivities,
  allPublications = [], // Default to empty
  allApplications = [],
  allProjects = [],
}: OverviewTabProps) {
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  // Research Output Chart State
  const [chartMode, setChartMode] = React.useState<"year" | "month">("year");
  const [selectedYear, setSelectedYear] = React.useState<number | null>(null);

  // Recruitment State
  const [recruitmentMode, setRecruitmentMode] = React.useState<
    "year" | "month"
  >("year");
  const [selectedRecruitmentYear, setSelectedRecruitmentYear] = React.useState<
    number | null
  >(null);

  // Funding State
  const [selectedFundingSource, setSelectedFundingSource] = React.useState<
    string | null
  >(null);

  // --- COMPUTED DATA ---

  // 2. Recruitment: Yearly & Monthly Data
  const recruitmentAggregates = React.useMemo(() => {
    const yearlyMap: Record<number, number> = {};
    allApplications.forEach((app) => {
      const d = new Date(app.submitted_date);
      if (!isNaN(d.getTime())) {
        const y = d.getFullYear();
        yearlyMap[y] = (yearlyMap[y] || 0) + 1;
      }
    });
    const yearlyData = Object.keys(yearlyMap)
      .map((y) => ({ year: parseInt(y), applications: yearlyMap[parseInt(y)] }))
      .sort((a, b) => a.year - b.year);

    const monthlyData = selectedRecruitmentYear
      ? (() => {
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const data = months.map((m) => ({ month: m, applications: 0 }));
          allApplications
            .filter(
              (a) =>
                new Date(a.submitted_date).getFullYear() ===
                selectedRecruitmentYear,
            )
            .forEach((app) => {
              const m = new Date(app.submitted_date).getMonth();
              if (data[m]) data[m].applications++;
            });
          return data;
        })()
      : [];

    return { yearlyData, monthlyData };
  }, [allApplications, selectedRecruitmentYear]);

  // 3. Funding: Project Detail List
  const fundingDetails = React.useMemo(() => {
    if (!selectedFundingSource) return [];
    return allProjects.filter(
      (p) =>
        (p.funding_source || p.fundingSource || "Internal") ===
        selectedFundingSource,
    );
  }, [selectedFundingSource, allProjects]);

  // --- HANDLERS ---

  const handleRecruitmentYearClick = (data: any) => {
    if (data && data.activePayload) {
      const year = data.activePayload[0].payload.year;
      setSelectedRecruitmentYear(Number(year));
      setRecruitmentMode("month");
    }
  };

  const handleFundingClick = (data: any) => {
    if (data && data.activePayload) {
      const source = data.activePayload[0].payload.name;
      setSelectedFundingSource(source);
    }
  };

  // Calculate Monthly Data for Selected Year
  const monthlyData = React.useMemo(() => {
    if (!selectedYear) return [];
    const yearPubs = allPublications.filter((p) => p.year === selectedYear);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize counts
    const data = months.map((m) => ({ month: m, count: 0 }));

    yearPubs.forEach((pub) => {
      const date = new Date(pub.publishedDate);
      // Fallback if publishedDate is invalid or missing, use random month based on hash
      let monthIndex = 0;
      if (!isNaN(date.getTime())) {
        monthIndex = date.getMonth();
      } else {
        // Deterministic fallback based on title length
        monthIndex = pub.title.length % 12;
      }
      if (data[monthIndex]) {
        data[monthIndex].count++;
      }
    });
    return data;
  }, [selectedYear, allPublications]);

  const handleYearClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const year = data.activePayload[0].payload.year;
      setSelectedYear(Number(year));
      setChartMode("month");
    }
  };

  // Custom Bar Click Handler
  const onBarClick = (data: any) => {
    // data contains the payload directly when clicking a Bar
    if (data && data.year) {
      setSelectedYear(Number(data.year));
      setChartMode("month");
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <DocumentChartBarIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                Active Projects
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalProjects}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                Total Funding
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${(stats.totalFunding / 1000000).toFixed(1)}M
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <DocumentTextIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                Publications
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.publications}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <BriefcaseIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                Open Roles
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.openOpportunities}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1: Funding Sources & Latest Publications (New) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Funding Sources Breakdown */}
        <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Funding Sources Breakdown
              </h3>
              <p className="text-xs text-gray-500">
                Total budget allocation by granting organization
              </p>
            </div>
            <div className="rounded bg-gray-50 px-2 py-1 text-xs font-bold text-gray-900">
              {/* Calculate total funding for display if needed, or just show unit */}
              Total: $
              {(
                fundingSourceData.reduce((acc, curr) => acc + curr.value, 0) /
                1000000
              ).toFixed(1)}
              M
            </div>
          </div>

          {/* Vertical Column Chart */}
          <div className="h-[300px] w-full">
            {!selectedFundingSource ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={fundingSourceData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  onClick={handleFundingClick}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F3F4F6"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 10 }}
                    dy={10}
                    interval={0}
                    angle={-10}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 10 }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "#F9FAFB" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: number | undefined) => [
                      `$${(value ?? 0).toLocaleString()}`,
                      "Amount",
                    ]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {fundingSourceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="custom-scrollbar h-full space-y-3 overflow-y-auto pr-2">
                {fundingDetails.length === 0 && (
                  <div className="py-8 text-center text-gray-400">
                    No projects found for this source.
                  </div>
                )}
                {fundingDetails.map((proj: any) => (
                  <div
                    key={proj.id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        {proj.name}
                      </h4>
                      <p className="line-clamp-1 text-xs text-gray-500">
                        {proj.summary}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">
                        ${(proj.budget || 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase">
                        {proj.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Latest Publications */}
        <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            Latest Publications
          </h3>
          <div className="custom-scrollbar max-h-[300px] flex-1 space-y-4 overflow-y-auto pr-2">
            {latestPublications.map((pub) => (
              <div
                key={pub.id}
                className="group rounded-xl border border-gray-100 bg-gray-50 p-3 transition-all hover:border-gray-200"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                    {pub.type}
                  </span>
                  <span className="text-[10px] font-medium text-gray-400">
                    {pub.year}
                  </span>
                </div>
                <h4 className="line-clamp-2 text-sm leading-snug font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                  {pub.title}
                </h4>
                <p className="mt-1 line-clamp-1 text-xs text-gray-500 italic">
                  {pub.venue}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Recruitment & Research Output (Existing) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recruitment Pulse */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Recruitment Pulse
              </h3>
              <p className="text-xs text-gray-500">
                {recruitmentMode === "year"
                  ? "Applications per year"
                  : `Applications in ${selectedRecruitmentYear}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {recruitmentMode === "month" && (
                <button
                  onClick={() => setRecruitmentMode("year")}
                  className="rounded bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  Back to Years
                </button>
              )}
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <ArrowTrendingUpIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {recruitmentMode === "year" ? (
                <AreaChart
                  data={recruitmentAggregates.yearlyData}
                  onClick={handleRecruitmentYearClick}
                >
                  <defs>
                    <linearGradient
                      id="colorAppsYear"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F3F4F6"
                  />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 10 }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAppsYear)"
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    activeDot={{ r: 6, onClick: handleRecruitmentYearClick }}
                  />
                </AreaChart>
              ) : (
                <AreaChart data={recruitmentAggregates.monthlyData}>
                  <defs>
                    <linearGradient
                      id="colorAppsMonth"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F3F4F6"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 10 }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAppsMonth)"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Research Output */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Research Output
              </h3>
              <p className="text-xs text-gray-500">
                {chartMode === "year"
                  ? "Publications per year"
                  : `Publications in ${selectedYear}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {chartMode === "month" && (
                <button
                  onClick={() => setChartMode("year")}
                  className="rounded bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  Back to Years
                </button>
              )}
              <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                <AcademicCapIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === "year" ? (
                <BarChart data={publicationsData} onClick={handleYearClick}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F3F4F6"
                  />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 10 }}
                    allowDecimals={false}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "#F9FAFB" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                    onClick={onBarClick}
                    className="cursor-pointer transition-opacity hover:opacity-80"
                  />
                </BarChart>
              ) : (
                <BarChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F3F4F6"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 10 }}
                    allowDecimals={false}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "#F9FAFB" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Recent Activities</h3>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-800">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-white text-xl shadow-sm">
                {/* Placeholder for activity icon/image */}
                📅
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  {activity.title}
                </h4>
                <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                  {activity.summary}
                </p>
                <div className="mt-2 flex items-center gap-3 text-[10px] font-medium tracking-wider text-gray-400 uppercase">
                  <span>
                    {new Date(activity.startDate).toLocaleDateString()}
                  </span>
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-bold tracking-wider uppercase ${
                      activity.activityTypeId?.includes("seminar")
                        ? "bg-purple-100 text-purple-700"
                        : activity.activityTypeId?.includes("workshop")
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {activity.activityTypeId
                      ?.replace("type_", "")
                      .toUpperCase() || "EVENT"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {recentActivities.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-400">
              No recent activities.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
