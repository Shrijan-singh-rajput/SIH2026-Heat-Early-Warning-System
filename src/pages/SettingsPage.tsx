const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configuration & Threshold Management</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Early Warning Parameters</h2>
        <p className="text-gray-600">
          Configuration options for alert thresholds, API endpoints, notification preferences,
          and system settings.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
