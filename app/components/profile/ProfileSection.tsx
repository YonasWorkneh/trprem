interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function ProfileSection({
  title,
  children,
}: ProfileSectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        {title}
      </h2>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
