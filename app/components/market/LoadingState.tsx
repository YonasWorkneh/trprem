export default function LoadingState() {
  return (
    <div className="w-full px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#F4D03F] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium text-gray-600">
              Loading market data...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
