import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../hooks/useAuth.js";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: location.pathname === "/admin",
    },
    {
      name: "Quản lý Sản phẩm",
      icon: Package,
      children: [
        {
          name: "Danh sách Sản phẩm",
          href: "/admin/products",
          current: location.pathname === "/admin/products",
        },
        {
          name: "Thêm Sản phẩm",
          href: "/admin/products/new",
          current: location.pathname === "/admin/products/new",
        },
      ],
    },
    {
      name: "Đơn hàng",
      href: "/admin/orders",
      icon: ShoppingCart,
      current: location.pathname.startsWith("/admin/orders"),
    },
    {
      name: "Khách hàng",
      href: "/admin/customers",
      icon: Users,
      current: location.pathname.startsWith("/admin/customers"),
    },
    {
      name: "Cài đặt",
      href: "/admin/settings",
      icon: Settings,
      current: location.pathname.startsWith("/admin/settings"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />

        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="px-4 py-4">
            {/* Mobile navigation items */}
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
                      onClick={() => setProductMenuOpen(!productMenuOpen)}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </div>
                      {productMenuOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {productMenuOpen && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={`block px-3 py-2 text-sm font-medium rounded-md ${
                              child.current
                                ? "bg-orange-100 text-orange-700"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      item.current
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            <Badge variant="secondary" className="text-xs">
              {user?.username}
            </Badge>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
                      onClick={() => setProductMenuOpen(!productMenuOpen)}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </div>
                      {productMenuOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {productMenuOpen && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={`block px-3 py-2 text-sm font-medium rounded-md ${
                              child.current
                                ? "bg-orange-100 text-orange-700"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      item.current
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => logout()}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Admin</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout()}
              className="text-red-600"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
