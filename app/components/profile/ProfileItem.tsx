import Link from "next/link";

interface ProfileItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  badge?: string;
}

export default function ProfileItem({
  icon,
  title,
  description,
  href,
  onClick,
  badge,
}: ProfileItemProps) {
  const content = (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="text-gray-700 shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">{title}</span>
            {badge && (
              <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">{description}</p>
        </div>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-400 shrink-0"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  if (onClick) {
    return <button onClick={onClick} className="w-full text-left">{content}</button>;
  }

  return content;
}
