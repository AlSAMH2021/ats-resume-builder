import {
  LayoutDashboard,
  FileText,
  Target,
  LogOut,
  Home,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import seeratyLogo from "@/assets/seeraty_logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "لوحة التحكم", titleEn: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "بناء السيرة", titleEn: "Resume Builder", url: "/builder", icon: FileText },
  { title: "المستهدفات", titleEn: "Targets", url: "/targets", icon: Target },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" side="right" className="border-s">
      <SidebarContent>
        <div className="p-3 flex items-center gap-2 border-b">
          <img src={seeratyLogo} alt="سيرتي" className="h-8" />
          {!collapsed && (
            <span className="text-sm font-semibold text-foreground">سيرتي</span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="me-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        {!collapsed && user && (
          <p className="text-xs text-muted-foreground truncate mb-2 px-1">
            {user.email}
          </p>
        )}
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="justify-start gap-2 w-full"
            onClick={() => navigate("/")}
          >
            <Home className="h-4 w-4" />
            {!collapsed && "الرئيسية"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start gap-2 w-full text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "تسجيل الخروج"}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
