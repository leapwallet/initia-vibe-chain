import { FileText, Home, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../components/ui/sidebar';
import { routes } from '../../utils/routes';

const navigationItems = [
  {
    title: 'Dashboard',
    url: routes.home,
    icon: Home,
  },
  {
    title: 'Page One',
    url: routes.pageOne,
    icon: FileText,
  },
  {
    title: 'Page Two',
    url: routes.pageTwo,
    icon: LayoutDashboard,
  },
];

export const AppSidebar = (props: React.ComponentProps<typeof Sidebar>) => {
  const location = useLocation();

  return (
    <Sidebar side="left" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:!p-1.5 [&>svg]:size-4"
            >
              <Link to={routes.home}>
                <div className="bg-primary/10 text-primary grid size-8 place-items-center rounded-lg">
                  <LayoutDashboard className="size-4" />
                </div>
                <span className="text-base font-semibold">App Name</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem className="mx-2" key={item.title}>
              <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
