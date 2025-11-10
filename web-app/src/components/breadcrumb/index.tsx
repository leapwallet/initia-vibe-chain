import { Link, useLocation } from 'react-router';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../components/ui/breadcrumb';
import { SidebarTrigger } from '../../components/ui/sidebar';
import { cn } from '../../lib/utils';
import { routes } from '../../utils/routes';
import { ThemeToggle } from '../theme/toggle';

// Define readable names for routes
const routeLabels: Record<string, string> = {
  [routes.home]: 'Dashboard',
  [routes.pageOne]: 'Page One',
  [routes.pageTwo]: 'Page Two',
};

export const AppBreadcrumb = ({ className }: { className?: string }) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Generate breadcrumb items from current path
  const generateBreadcrumbs = () => {
    const breadcrumbs = [];

    // Always start with Dashboard
    breadcrumbs.push({
      label: 'Dashboard',
      path: routes.home,
      isActive: pathname === routes.home,
    });

    // If not on home page, add current page
    if (pathname !== routes.home) {
      const currentLabel = routeLabels[pathname] || pathname.split('/').pop();

      breadcrumbs.push({
        label: currentLabel,
        path: pathname,
        isActive: true,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className={cn('z-10 flex w-full items-center gap-2 px-4', className)}>
      <SidebarTrigger className="-ml-1" />

      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.path} className="flex items-center">
              <BreadcrumbItem>
                {breadcrumb.isActive && index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={breadcrumb.path}>{breadcrumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <ThemeToggle className="ml-auto" />
    </div>
  );
};
