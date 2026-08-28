const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Citywide Heat Risk Dashboard</h1>
        <p className="text-gray-600">Bhubaneswar Thermal Stress & Vulnerability Overview</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Dashboard Overview</h2>
        <p className="text-gray-600">
          This dashboard will display real-time heat risk indicators, human thermal stress metrics
          (UTCI, WBGT, Heat Index), ward-level risk summaries, and 3-5 day advance forecasting for Bhubaneswar.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
