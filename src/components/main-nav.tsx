import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import clsx from "clsx";

const links = [
  { name: "Overview", path: "/" },
  { name: "Transfer", path: "/transfer" },
  { name: "Settings", path: "/settings" },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((link) => (
        <Link
          href={link.path}
          className={clsx(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname !== link.path && "text-muted-foreground",
          )}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
