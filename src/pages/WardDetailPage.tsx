import { useParams } from 'react-router-dom';

const WardDetailPage = () => {
  const { zoneCode } = useParams<{ zoneCode: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Ward Detail Analysis</h1>
        <p className="text-gray-600 dark:text-gray-400">Zone Code: {zoneCode || 'Unknown'}</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-gray-100">Ward Profile & Forecast</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Localized thermal metrics, demographic vulnerability details, health risk predictions,
          and actionable recommendations for Ward {zoneCode}.
        </p>
      </div>
    </div>
  );
};

export default WardDetailPage;
