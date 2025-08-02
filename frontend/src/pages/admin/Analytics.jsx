import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  Package,
  Filter,
  FileBarChart,
  LineChart,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";
import { GET_DETAILED_ANALYTICS } from "../../graphql/admin/analytics.js";

function Analytics() {
  // Date filter state
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split("T")[0];
  });

  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [period, setPeriod] = useState("DAY");

  // GraphQL query
  const { data, loading, error, refetch } = useQuery(GET_DETAILED_ANALYTICS, {
    variables: {
      filter: {
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        period: period,
      },
    },
  });

  const analytics = data?.detailedAnalytics;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  // Format short date for chart
  const formatShortDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{formatDate(label)}</p>
          <p className="text-green-600">
            Doanh thu: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-blue-600">
            Đơn hàng: {payload[1] ? payload[1].value : 0}
          </p>
        </div>
      );
    }
    return null;
  };

  // Handle filter apply
  const handleApplyFilter = () => {
    refetch({
      filter: {
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        period: period,
      },
    });
  };

  // Quick date filters
  const setQuickFilter = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
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
            <p className="text-red-600">Có lỗi xảy ra: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Báo cáo Chi tiết</h1>
        <p className="text-gray-600 mt-1">
          Phân tích doanh thu và đơn hàng theo thời gian
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc thời gian
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Period */}
            <div className="space-y-2">
              <Label>Chu kỳ</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chu kỳ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAY">Ngày</SelectItem>
                  <SelectItem value="WEEK">Tuần</SelectItem>
                  <SelectItem value="MONTH">Tháng</SelectItem>
                  <SelectItem value="QUARTER">Quý</SelectItem>
                  <SelectItem value="YEAR">Năm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Apply Button */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={handleApplyFilter} className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Áp dụng
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickFilter(7)}
            >
              7 ngày
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickFilter(30)}
            >
              30 ngày
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickFilter(90)}
            >
              90 ngày
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickFilter(365)}
            >
              1 năm
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng Đơn hàng
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics.totalOrders}
                </div>
                <p className="text-xs text-muted-foreground">
                  Từ {formatDate(startDate)} đến {formatDate(endDate)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng Doanh thu
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(analytics.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Từ {formatDate(startDate)} đến {formatDate(endDate)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Giá trị TB/Đơn
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(analytics.averageOrderValue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Trung bình mỗi đơn hàng
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead className="text-right">Số lượng bán</TableHead>
                    <TableHead className="text-right">Doanh thu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.topProducts.map((product, index) => (
                    <TableRow key={product.productId}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          {product.productName}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {product.totalSold}
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        {formatCurrency(product.totalRevenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Biểu đồ Doanh thu & Đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={analytics.dailyBreakdown}>
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatShortDate}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      yAxisId="revenue"
                      orientation="left"
                      tickFormatter={(value) =>
                        `${(value / 1000000).toFixed(1)}M`
                      }
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      yAxisId="orders"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      yAxisId="revenue"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      fill="url(#revenueGradient)"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="orders"
                      type="monotone"
                      dataKey="orderCount"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Chart Legend */}
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Doanh thu (VND)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Số đơn hàng</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Chi tiết theo ngày
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead className="text-right">Số đơn hàng</TableHead>
                    <TableHead className="text-right">Doanh thu</TableHead>
                    <TableHead className="text-right">TB/Đơn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.dailyBreakdown.map((day) => (
                    <TableRow key={day.date}>
                      <TableCell className="font-medium">
                        {formatDate(day.date)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{day.orderCount}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        {formatCurrency(day.revenue)}
                      </TableCell>
                      <TableCell className="text-right text-gray-600">
                        {day.orderCount > 0
                          ? formatCurrency(day.revenue / day.orderCount)
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default Analytics;
