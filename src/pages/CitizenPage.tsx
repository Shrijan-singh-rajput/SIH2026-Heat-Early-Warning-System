const CitizenPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Citizen Safety Portal</h1>
        <p className="text-gray-600 dark:text-gray-400">Localized Heat Safety Information & Guidance</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-gray-100">Public Heat Advisory & Protection Tips</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Actionable heat safety recommendations, cooling shelter locations, hydration tips, and
          symptom checkers for citizens of Bhubaneswar.
        </p>
      </div>
    </div>
  );
};

export default CitizenPage;
