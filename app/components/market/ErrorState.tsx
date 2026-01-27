interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="w-full px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-600"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to load market data
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md">
              {message}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-[var(--theme-primary)] text-[var(--theme-primary-text)] px-6 py-2 rounded-full text-sm font-medium hover:bg-[var(--theme-primary-hover)] transition-colors cursor-pointer"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
