import type { Locale } from '../../types/program';

/**
 * Lightweight hand-rolled charts (SVG + CSS) for the demo admin dashboard.
 * No charting dependency — bars, sparkline area, and a donut.
 */

export interface ChartItem {
  label: string;
  value: number;
}

/** Horizontal bar list — course/category distribution and popularity. */
export function AdminBarChart({
  items,
  locale,
  color = '#28B5C5',
  emptyLabel,
}: {
  items: ChartItem[];
  locale: Locale;
  color?: string;
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="py-6 text-center text-[0.82rem] text-[#94A3B8]">{emptyLabel}</p>;
  }
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-[38%] min-w-0 truncate text-[0.78rem] font-bold text-[#183247] dark:text-[#B8C7D9]">
            {item.label}
          </span>
          <div
            className="h-[10px] flex-1 overflow-hidden rounded-full bg-[#EAF3F6] dark:bg-[#0B1726]"
            role="img"
            aria-label={`${item.label}: ${item.value}`}
          >
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${Math.round((item.value / max) * 100)}%`, backgroundColor: color }}
            />
          </div>
          <span className="num w-8 flex-none text-end text-[0.78rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
            {item.value}
          </span>
        </div>
      ))}
      <p className="text-[0.7rem] text-[#94A3B8] dark:text-[#7E93A9]">
        {locale === 'ar' ? 'بيانات تجريبية لأغراض العرض' : 'Mock data for demo purposes'}
      </p>
    </div>
  );
}


/** Area sparkline for monthly student activity. */
export function AdminActivityChart({
  points,
  height = 140,
}: {
  points: Array<{ label: string; count: number }>;
  height?: number;
}) {
  const width = 320;
  const max = Math.max(...points.map((p) => p.count), 1);
  const stepX = points.length > 1 ? width / (points.length - 1) : width;
  const coords = points.map((point, index) => ({
    x: index * stepX,
    y: height - 24 - (point.count / max) * (height - 46),
  }));
  const linePath = coords
    .map((coord, index) => `${index === 0 ? 'M' : 'L'}${coord.x.toFixed(1)},${coord.y.toFixed(1)}`)
    .join(' ');
  const areaPath = coords.length ? `${linePath} L${width},${height - 24} L0,${height - 24} Z` : '';

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Enrollment activity"
      >
        <defs>
          <linearGradient id="adminActivityFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#28B5C5" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#28B5C5" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {areaPath && <path d={areaPath} fill="url(#adminActivityFill)" />}
        <path d={linePath} fill="none" stroke="#176B87" strokeWidth="2.5" strokeLinejoin="round" />
        {coords.map((coord, index) => (
          <g key={points[index].label}>
            <circle cx={coord.x} cy={coord.y} r="4" fill="#28B5C5" stroke="#fff" strokeWidth="1.5" />
            <text
              x={coord.x}
              y={height - 6}
              textAnchor="middle"
              className="fill-[#64748B] dark:fill-[#B8C7D9]"
              fontSize="10"
              fontWeight="700"
            >
              {points[index].label}
            </text>
            <text
              x={coord.x}
              y={coord.y - 9}
              textAnchor="middle"
              className="fill-[#142D4E] dark:fill-[#F1F5F9]"
              fontSize="10.5"
              fontWeight="800"
            >
              {points[index].count}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}


/** Donut with center value — published vs draft (or any segments). */
export function AdminDonut({
  segments,
  centerValue,
  centerLabel,
  legend,
}: {
  segments: Array<{ value: number; color: string }>;
  centerValue: string;
  centerLabel: string;
  legend: string[];
}) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-5">
      <svg
        viewBox="0 0 130 130"
        className="h-[130px] w-[130px] flex-none"
        role="img"
        aria-label={centerLabel}
      >
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="#EAF3F6"
          strokeWidth="16"
          className="dark:opacity-20"
        />
        {total > 0 &&
          segments.map((segment, index) => {
            const dash = (segment.value / total) * circumference;
            const element = (
              <circle
                key={index}
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="16"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 65 65)"
                strokeLinecap="butt"
              />
            );
            offset += dash;
            return element;
          })}
        <text
          x="65"
          y="60"
          textAnchor="middle"
          fontSize="26"
          fontWeight="800"
          className="fill-[#142D4E] dark:fill-[#F1F5F9]"
        >
          {centerValue}
        </text>
        <text
          x="65"
          y="82"
          textAnchor="middle"
          fontSize="10.5"
          fontWeight="700"
          className="fill-[#64748B] dark:fill-[#B8C7D9]"
        >
          {centerLabel}
        </text>
      </svg>
      <ul className="space-y-2">
        {segments.map((segment, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-[0.8rem] font-bold text-[#183247] dark:text-[#B8C7D9]"
          >
            <span className="h-3 w-3 rounded-[4px]" style={{ backgroundColor: segment.color }} />
            <span className="num">{segment.value}</span> {legend[index] ?? ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
