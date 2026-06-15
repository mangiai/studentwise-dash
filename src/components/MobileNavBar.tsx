import { Link } from "@tanstack/react-router";
import { Menu, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { APP_LOGO_SHORT, APP_NAME } from "@/lib/brand";

export type MobileNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  useLink?: boolean;
};

type MobileNavBarProps = {
  items: MobileNavItem[];
  path: string;
  primaryCount?: number;
};

function isActive(path: string, item: MobileNavItem) {
  return item.exact ? path === item.to : path.startsWith(item.to);
}

function NavButton({
  item,
  path,
  compact,
}: {
  item: MobileNavItem;
  path: string;
  compact?: boolean;
}) {
  const active = isActive(path, item);
  const Icon = item.icon;
  const className = cn(
    "flex flex-col items-center justify-center gap-0.5 rounded-lg transition-all duration-200 min-w-0 flex-1",
    compact ? "py-1.5 px-1" : "py-2 px-2",
    active
      ? "text-primary scale-105"
      : "text-muted-foreground hover:text-foreground active:scale-95",
  );

  const inner = (
    <>
      <Icon className={cn("size-5 shrink-0", active && "drop-shadow-sm")} strokeWidth={active ? 2.25 : 2} />
      <span className={cn("text-[10px] font-medium truncate max-w-full", active && "font-semibold")}>
        {item.label.split(" ")[0]}
      </span>
    </>
  );

  if (item.useLink === false) {
    return (
      <a href={item.to} className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link to={item.to} className={className}>
      {inner}
    </Link>
  );
}

export function MobileNavBar({ items, path, primaryCount = 4 }: MobileNavBarProps) {
  const primary = items.slice(0, primaryCount);
  const overflow = items.slice(primaryCount);

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-primary/10 bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/80 pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch h-16 px-1 max-w-lg mx-auto">
        {primary.map((item) => (
          <NavButton key={item.to} item={item} path={path} compact />
        ))}

        {overflow.length > 0 && (
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 rounded-lg flex-1 py-1.5 px-1 transition-all duration-200",
                  overflow.some((i) => isActive(path, i))
                    ? "text-primary scale-105"
                    : "text-muted-foreground hover:text-foreground active:scale-95",
                )}
              >
                <Menu className="size-5" />
                <span className="text-[10px] font-medium">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl pb-[env(safe-area-inset-bottom)]">
              <SheetHeader className="text-left pb-2">
                <SheetTitle className="flex items-center gap-2 text-base font-bold">
                  <span className="size-8 rounded-lg bg-primary text-primary-foreground grid place-content-center text-xs font-bold">
                    {APP_LOGO_SHORT}
                  </span>
                  {APP_NAME}
                </SheetTitle>
              </SheetHeader>
              <div className="grid gap-1 max-h-[50vh] overflow-y-auto pb-4">
                {items.map((item) => {
                  const active = isActive(path, item);
                  const Icon = item.icon;
                  const rowClass = cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors",
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted",
                  );

                  if (item.useLink === false) {
                    return (
                      <a key={item.to} href={item.to} className={rowClass}>
                        <Icon className="size-4 shrink-0" />
                        {item.label}
                      </a>
                    );
                  }

                  return (
                    <Link key={item.to} to={item.to} className={rowClass}>
                      <Icon className="size-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </nav>
  );
}

type MobileMenuButtonProps = {
  items: MobileNavItem[];
  path: string;
  title?: string;
};

export function MobileMenuButton({ items, path, title = APP_NAME }: MobileMenuButtonProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="lg:hidden flex items-center justify-center size-9 rounded-lg border bg-background hover:bg-muted transition-colors active:scale-95"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(100vw-2rem,18rem)] p-0 bg-sidebar text-sidebar-foreground border-sidebar-border">
        <SheetHeader className="p-4 border-b border-sidebar-border text-left">
          <SheetTitle className="flex items-center gap-2 text-sidebar-foreground font-bold">
            <span className="size-9 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground grid place-content-center text-sm font-bold">
              {APP_LOGO_SHORT}
            </span>
            <span className="text-sm font-semibold">{title}</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="p-3 space-y-0.5">
          {items.map((item) => {
            const active = isActive(path, item);
            const Icon = item.icon;
            const rowClass = cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
            );

            if (item.useLink === false) {
              return (
                <a key={item.to} href={item.to} className={rowClass}>
                  <Icon className="size-4" />
                  {item.label}
                </a>
              );
            }

            return (
              <Link key={item.to} to={item.to} className={rowClass}>
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
