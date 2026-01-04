import { LofiPreview } from "../LofiPreview";

export default {
  title: "Compositions/Dashboard",
  component: LofiPreview,
};

export const Analytics = {
  args: {
    source: `page "Analytics Dashboard"
  nav
    avatar src="https://i.pravatar.cc/40" alt="User"
    link "Dashboard" active=1
    link "Reports"
    link "Settings"
  grid flow=vertical gap=4
    grid cols=3 gap=4
      card
        text "Total Users" muted=1
        heading "12,345" level="2"
        badge "Up 12%" type="success"
      card
        text "Revenue" muted=1
        heading "$45,678" level="2"
        badge "Up 8%" type="success"
      card
        text "Conversion" muted=1
        heading "3.2%" level="2"
        badge "Down 2%" type="error"
    grid cols="2" gap="4"
      card
        heading "Revenue Trend"
        chart "Revenue" type="line"
      card
        heading "User Distribution"
        chart "Users" type="pie"`,
  },
};

export const AdminPanel = {
  args: {
    source: `page "Admin Panel"
    menu
      link "Dashboard" active=1
      link "Users"
      link "Products"
      link "Orders"
      link "Settings"
    breadcrumb
      link "Home"
      link "Dashboard"
    heading "Welcome back"
    grid cols="2" gap="4"
      card
        heading "Recent Orders"
        md
          | Order | Customer | Status |
          |-------|----------|--------|
          | #1234 | Alice | Shipped |
          | #1235 | Bob | Pending |
          | #1236 | Carol | Delivered |
      card
        heading "Quick Actions"
        grid flow="vertical" gap="2"
          button "Add Product" primary=1
          button "View Reports"
          button "Manage Users"`,
  },
};
