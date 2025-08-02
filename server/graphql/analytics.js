import { Order } from "../data/models/order.js";
import User from "../data/models/user.js";

export const typeDef = `
  scalar DateTime

  type OrderStats {
    today: Int!
    thisWeek: Int!
    thisMonth: Int!
    thisQuarter: Int!
    thisYear: Int!
  }

  type RevenueStats {
    today: Float!
    thisWeek: Float!
    thisMonth: Float!
    thisQuarter: Float!
    thisYear: Float!
  }

  type DailyRevenue {
    date: String!
    revenue: Float!
    orderCount: Int!
  }

  type RecentOrder {
    _id: ID!
    userId: ID!
    totalAmount: Float!
    status: String!
    itemCount: Int!
    createdAt: DateTime!
  }

  type CustomerStats {
    newCustomersToday: Int!
    newCustomersThisWeek: Int!
    newCustomersThisMonth: Int!
    totalCustomers: Int!
  }

  type DashboardOverview {
    orderStats: OrderStats!
    revenueStats: RevenueStats!
    customerStats: CustomerStats!
    dailyRevenue: [DailyRevenue!]!
    recentOrders: [RecentOrder!]!
  }

  type DetailedAnalytics {
    totalOrders: Int!
    totalRevenue: Float!
    averageOrderValue: Float!
    topProducts: [ProductSales!]!
    dailyBreakdown: [DailyRevenue!]!
  }

  type ProductSales {
    productId: ID!
    productName: String!
    totalSold: Int!
    totalRevenue: Float!
  }

  input AnalyticsFilter {
    startDate: DateTime!
    endDate: DateTime!
    period: AnalyticsPeriod
  }

  enum AnalyticsPeriod {
    DAY
    WEEK
    MONTH
    QUARTER
    YEAR
  }

  extend type Query {
    dashboardOverview: DashboardOverview!
    detailedAnalytics(filter: AnalyticsFilter!): DetailedAnalytics!
  }
`;

export const resolvers = {
  Query: {
    dashboardOverview: async (parent, args, context, info) => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay());
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisQuarterStart = new Date(
        now.getFullYear(),
        Math.floor(now.getMonth() / 3) * 3,
        1
      );
      const thisYearStart = new Date(now.getFullYear(), 0, 1);

      // Order Statistics
      const [
        ordersToday,
        ordersThisWeek,
        ordersThisMonth,
        ordersThisQuarter,
        ordersThisYear,
      ] = await Promise.all([
        Order.countDocuments({ createdAt: { $gte: today } }),
        Order.countDocuments({
          createdAt: { $gte: thisWeekStart },
        }),
        Order.countDocuments({
          createdAt: { $gte: thisMonthStart },
        }),
        Order.countDocuments({
          createdAt: { $gte: thisQuarterStart },
        }),
        Order.countDocuments({
          createdAt: { $gte: thisYearStart },
        }),
      ]);

      // Revenue Statistics
      const revenueAggregation = async (startDate) => {
        const result = await Order.aggregate([
          { $match: { createdAt: { $gte: startDate }, status: "completed" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);
        return result[0]?.total || 0;
      };

      const [
        revenueToday,
        revenueThisWeek,
        revenueThisMonth,
        revenueThisQuarter,
        revenueThisYear,
      ] = await Promise.all([
        revenueAggregation(today),
        revenueAggregation(thisWeekStart),
        revenueAggregation(thisMonthStart),
        revenueAggregation(thisQuarterStart),
        revenueAggregation(thisYearStart),
      ]);

      // Customer Statistics
      const [
        newCustomersToday,
        newCustomersThisWeek,
        newCustomersThisMonth,
        totalCustomers,
      ] = await Promise.all([
        User.countDocuments({
          role: "customer",
          createdAt: { $gte: today },
        }),
        User.countDocuments({
          role: "customer",
          createdAt: { $gte: thisWeekStart },
        }),
        User.countDocuments({
          role: "customer",
          createdAt: { $gte: thisMonthStart },
        }),
        User.countDocuments({ role: "customer" }),
      ]);

      // Daily Revenue for last 7 days
      const last7Days = new Date(today);
      last7Days.setDate(today.getDate() - 6);

      const dailyRevenueData = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: last7Days },
            status: "completed",
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            revenue: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Generate all 7 days (fill missing days with 0)
      const dailyRevenue = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(last7Days);
        date.setDate(last7Days.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];

        const dayData = dailyRevenueData.find((d) => d._id === dateStr);
        dailyRevenue.push({
          date: dateStr,
          revenue: dayData?.revenue || 0,
          orderCount: dayData?.orderCount || 0,
        });
      }

      // Recent Orders (last 5)
      const recentOrdersData = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5);

      const recentOrders = recentOrdersData.map((order) => ({
        _id: order._id,
        userId: order.userId,
        totalAmount: order.totalAmount,
        status: order.status,
        itemCount: order.items?.length || 0,
        createdAt: order.createdAt,
      }));

      return {
        orderStats: {
          today: ordersToday,
          thisWeek: ordersThisWeek,
          thisMonth: ordersThisMonth,
          thisQuarter: ordersThisQuarter,
          thisYear: ordersThisYear,
        },
        revenueStats: {
          today: revenueToday,
          thisWeek: revenueThisWeek,
          thisMonth: revenueThisMonth,
          thisQuarter: revenueThisQuarter,
          thisYear: revenueThisYear,
        },
        customerStats: {
          newCustomersToday,
          newCustomersThisWeek,
          newCustomersThisMonth,
          totalCustomers,
        },
        dailyRevenue,
        recentOrders,
      };
    },

    detailedAnalytics: async (parent, { filter }, context, info) => {
      const { startDate, endDate } = filter;

      // Total orders and revenue in date range
      const [totalOrders, revenueData] = await Promise.all([
        Order.countDocuments({
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        }),
        Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
              },
              status: "completed",
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
              orderCount: { $sum: 1 },
            },
          },
        ]),
      ]);

      const totalRevenue = revenueData[0]?.totalRevenue || 0;
      const completedOrders = revenueData[0]?.orderCount || 0;
      const averageOrderValue =
        completedOrders > 0 ? totalRevenue / completedOrders : 0;

      // Top Products
      const topProducts = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
            status: "completed",
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            productName: { $first: "$items.productName" },
            totalSold: { $sum: "$items.quantity" },
            totalRevenue: { $sum: "$items.total" },
          },
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 10 },
      ]);

      // Daily breakdown
      const dailyBreakdown = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
            status: "completed",
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            revenue: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const formattedDailyBreakdown = dailyBreakdown.map((day) => ({
        date: day._id,
        revenue: day.revenue,
        orderCount: day.orderCount,
      }));

      return {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        topProducts: topProducts.map((product) => ({
          productId: product._id,
          productName: product.productName,
          totalSold: product.totalSold,
          totalRevenue: product.totalRevenue,
        })),
        dailyBreakdown: formattedDailyBreakdown,
      };
    },
  },
};
