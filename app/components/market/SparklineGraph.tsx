interface SparklineGraphProps {
  data: number[];
  isPositive: boolean;
  width?: number;
  height?: number;
}

export default function SparklineGraph({
  data,
  isPositive,
  width = 100,
  height = 40,
}: SparklineGraphProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width, height }}
      >
        <span className="text-xs text-gray-400">No data</span>
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1 || 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(" L ")}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={pathData}
        fill="none"
        stroke={isPositive ? "#10b981" : "#ef4444"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
