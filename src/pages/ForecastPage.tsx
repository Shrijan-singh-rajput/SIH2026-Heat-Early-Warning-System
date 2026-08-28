const ForecastPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Heat Forecast</h1>
        <p className="text-gray-600">3–5 Day Advance Thermal Stress Forecasting</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Multi-Day Forecast Analysis</h2>
        <p className="text-gray-600">
          Forecasting model outputs showing predicted thermal stress metrics, mortality risk,
          and hospitalization risk.
        </p>
      </div>
    </div>
  );
};

export default ForecastPage;
