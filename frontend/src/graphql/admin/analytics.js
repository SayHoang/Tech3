import { gql } from "@apollo/client";

// Dashboard Overview Query
export const GET_DASHBOARD_OVERVIEW = gql`
  query GetDashboardOverview {
    dashboardOverview {
      orderStats {
        today
        thisWeek
        thisMonth
        thisQuarter
        thisYear
      }
      revenueStats {
        today
        thisWeek
        thisMonth
        thisQuarter
        thisYear
      }
      customerStats {
        newCustomersToday
        newCustomersThisWeek
        newCustomersThisMonth
        totalCustomers
      }
      dailyRevenue {
        date
        revenue
        orderCount
      }
      recentOrders {
        _id
        userId
        totalAmount
        status
        itemCount
        createdAt
      }
    }
  }
`;

// Detailed Analytics Query
export const GET_DETAILED_ANALYTICS = gql`
  query GetDetailedAnalytics($filter: AnalyticsFilter!) {
    detailedAnalytics(filter: $filter) {
      totalOrders
      totalRevenue
      averageOrderValue
      topProducts {
        productId
        productName
        totalSold
        totalRevenue
      }
      dailyBreakdown {
        date
        revenue
        orderCount
      }
    }
  }
`;
