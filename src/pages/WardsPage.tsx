const WardsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Bhubaneswar Wards</h1>
        <p className="text-gray-600 dark:text-gray-400">Zone-Level Heat Vulnerability & Risk Directory</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-gray-100">Ward Risk Overview</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Detailed breakdown of all Bhubaneswar administrative wards, demographic vulnerabilities,
          and localized risk assessments.
        </p>
      </div>
    </div>
  );
};

export default WardsPage;
