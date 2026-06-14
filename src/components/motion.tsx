import { cn } from "@/lib/utils";

type PageContentProps = {
  children: React.ReactNode;
  className?: string;
};

/** Fade-in page wrapper with staggered children */
export function PageContent({ children, className }: PageContentProps) {
  return (
    <div className={cn("animate-page-enter stagger-children", className)}>
      {children}
    </div>
  );
}

type AnimatedGridProps = {
  children: React.ReactNode;
  className?: string;
};

/** Grid/list container — children fade up with stagger */
export function AnimatedGrid({ children, className }: AnimatedGridProps) {
  return <div className={cn("stagger-children", className)}>{children}</div>;
}

type InteractiveCardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
};

/** Subtle 3D lift on hover — use instead of Card for stat tiles */
export function InteractiveCard({ children, className, ...props }: InteractiveCardProps) {
  return (
    <div className={cn("card-interactive rounded-xl border bg-card text-card-foreground shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}

/** Floating decorative orbs for auth/marketing panels */
export function AmbientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />
    </div>
  );
}
