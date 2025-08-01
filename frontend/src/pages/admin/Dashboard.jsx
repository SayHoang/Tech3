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
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Dashboard() {
  // Mock data - in real app, these would come from GraphQL queries
  const stats = {
    totalProducts: 45,
    totalOrders: 128,
    totalCustomers: 89,
    todayRevenue: 15750000,
  };

  const recentProducts = [
    {
      id: 1,
      name: "5.11 Tactical TPT EDC",
      price: 1200000,
      category: "Pliers",
    },
    {
      id: 2,
      name: "Leatherman Surge Heavy Duty",
      price: 3600000,
      category: "Pliers",
    },
    { id: 3, name: "Outdoor Tactical Tent", price: 2500000, category: "Tent" },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

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
            <CardTitle className="text-sm font-medium">Tổng Sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">+2 từ tuần trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+12% từ tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">+5 khách hàng mới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Doanh thu hôm nay
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.todayRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">+8% so với hôm qua</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sản phẩm gần đây</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/products">
                  <Eye className="h-4 w-4 mr-2" />
                  Xem tất cả
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-orange-600">
                      {formatCurrency(product.price)}
                    </p>
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
