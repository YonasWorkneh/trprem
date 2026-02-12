import { LucideIcon } from "lucide-react";

interface AdminEmptyStateProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function AdminEmptyState({ 
  title, 
  description, 
  icon: Icon, 
  action 
}: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground opacity-30" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
