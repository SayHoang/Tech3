import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layout Components
import HeaderMain from "./components/HeaderMain";
import Footer from "./components/Footer";
import CartDropdown from "./components/CartDropdown";
import AdminLayout from "./components/AdminLayout";
import RequireAuth from "./components/RequireAuth";

// Page Components (main UI pages)
import HomePage from "./pages/HomePage";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";

// Admin Page Components
import Dashboard from "./pages/admin/Dashboard";
import ProductList from "./pages/admin/ProductList";
import ProductForm from "./pages/admin/ProductForm";
import Analytics from "./pages/admin/Analytics";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login/Register Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes - Protected and with AdminLayout */}
          <Route
            path="/admin/*"
            element={
              <RequireAuth requiredRole="admin">
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="analytics" element={<Analytics />} />
            {/* Future admin routes */}
            <Route
              path="orders"
              element={
                <div className="p-6">Quản lý Đơn hàng - Coming Soon</div>
              }
            />
            <Route
              path="customers"
              element={
                <div className="p-6">Quản lý Khách hàng - Coming Soon</div>
              }
            />
            <Route
              path="settings"
              element={<div className="p-6">Cài đặt - Coming Soon</div>}
            />
          </Route>

          {/* Customer Routes - Normal layout */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-background">
                <HeaderMain />
                <main>
                  <Routes>
                    {/* Public routes - Guest can access */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/category/:id" element={<Category />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />

                    {/* Customer-only routes - Require authentication */}
                    <Route
                      path="/cart"
                      element={
                        <RequireAuth>
                          <Cart />
                        </RequireAuth>
                      }
                    />

                    <Route path="*" element={<NoPage />} />
                  </Routes>
                </main>
                <Footer />
                {/* Cart Dropdown - Global component */}
                <CartDropdown />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
