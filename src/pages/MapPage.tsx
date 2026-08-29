const MapPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">GIS Heat Risk Map</h1>
        <p className="text-gray-600 dark:text-gray-400">Hyper-Local Ward Level Heat Vulnerability Map</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-gray-100">Interactive Heat Map</h2>
        <p className="text-gray-600 mb-4 dark:text-gray-400">
          GIS-based visualization using Leaflet for ward/zone-level heat risk mapping across Bhubaneswar.
        </p>
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:bg-gray-900 dark:border-gray-600">
          <p className="text-gray-500 font-medium dark:text-gray-400">GIS Map Component Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
