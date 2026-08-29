const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Heat Analytics & Trends</h1>
        <p className="text-gray-600 dark:text-gray-400">Historical Analysis & Model Performance Metrics</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-gray-100">Thermal Trends & Vulnerability Analysis</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Analytical views using Recharts for thermal metrics comparison, mortality risk correlation,
          and vulnerability factors.
        </p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
