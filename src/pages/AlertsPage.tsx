const AlertsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Early Warning Alerts</h1>
        <p className="text-gray-600 dark:text-gray-400">Automated Authority & Public Heat Safety Advisories</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-gray-100">Active & Historical Alerts</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Color-coded alert system with automated public health recommendations for municipal authorities
          and emergency responders.
        </p>
      </div>
    </div>
  );
};

export default AlertsPage;
