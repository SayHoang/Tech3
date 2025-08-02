import { useQuery } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Eye,
  Plus,
  Calendar,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GET_DASHBOARD_OVERVIEW } from "../../graphql/admin/analytics.js";

function Dashboard() {
  // Fetch dashboard data
  const { data, loading, error } = useQuery(GET_DASHBOARD_OVERVIEW, {
    errorPolicy: "all",
  });

  const dashboardData = data?.dashboardOverview;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date for recent orders
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("vi-VN");
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Có lỗi xảy ra khi tải dashboard: {error.message}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Tổng quan hệ thống CampFire Outdoor Equipment
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đơn hàng hôm nay
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.orderStats?.today || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Tuần này: {dashboardData?.orderStats?.thisWeek || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Doanh thu hôm nay
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(dashboardData?.revenueStats?.today || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Tháng này:{" "}
              {formatCurrency(dashboardData?.revenueStats?.thisMonth || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Khách hàng mới
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.customerStats?.newCustomersToday || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng: {dashboardData?.customerStats?.totalCustomers || 0} khách
              hàng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đơn hàng tháng này
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {dashboardData?.orderStats?.thisMonth || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Năm này: {dashboardData?.orderStats?.thisYear || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Đơn hàng gần đây</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/analytics">
                  <Eye className="h-4 w-4 mr-2" />
                  Xem chi tiết
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.recentOrders?.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">#{order._id.slice(-6)}</p>
                    <p className="text-sm text-gray-600">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getStatusBadgeColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </Badge>
                      <span className="ml-2">{order.itemCount} sản phẩm</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart (7 days) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Doanh thu 7 ngày qua
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData?.dailyRevenue?.map((day) => (
                <div
                  key={day.date}
                  className="flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">
                      {new Date(day.date).toLocaleDateString("vi-VN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-sm text-gray-600">
                      {day.orderCount} đơn
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">
                      {formatCurrency(day.revenue)}
                    </div>
                    <div
                      className="h-2 bg-green-200 rounded-full mt-1"
                      style={{ width: "60px" }}
                    >
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            (day.revenue /
                              Math.max(
                                ...(dashboardData?.dailyRevenue?.map(
                                  (d) => d.revenue
                                ) || [1])
                              )) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button asChild className="justify-start h-auto p-4">
                <Link to="/admin/products/new">
                  <Plus className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Thêm Sản phẩm mới</div>
                    <div className="text-sm opacity-90">
                      Tạo sản phẩm mới cho cửa hàng
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="justify-start h-auto p-4"
              >
                <Link to="/admin/products">
                  <Package className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Quản lý Sản phẩm</div>
                    <div className="text-sm text-gray-600">
                      Xem và chỉnh sửa sản phẩm
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="justify-start h-auto p-4"
              >
                <Link to="/admin/analytics">
                  <TrendingUp className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Báo cáo & Phân tích</div>
                    <div className="text-sm text-gray-600">
                      Xem báo cáo doanh thu chi tiết
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="justify-start h-auto p-4"
              >
                <Link to="/admin/orders">
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Quản lý Đơn hàng</div>
                    <div className="text-sm text-gray-600">
                      Xem và xử lý đơn hàng
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="justify-start h-auto p-4"
              >
                <Link to="/admin/customers">
                  <Users className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Quản lý Khách hàng</div>
                    <div className="text-sm text-gray-600">
                      Xem thông tin khách hàng
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500 rounded-full">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Chào mừng đến với Admin Panel!
              </h3>
              <p className="text-gray-600">
                Quản lý toàn bộ hệ thống CampFire Outdoor Equipment từ đây. Bắt
                đầu bằng việc quản lý sản phẩm hoặc xem báo cáo doanh thu.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
