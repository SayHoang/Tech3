import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GET_ALL_CATEGORIES } from "../graphql/categories.js";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../hooks/useCart.js";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Heart,
  MapPin,
  Phone,
  Tent,
  Shirt,
  Footprints,
  Package,
  Grid3X3,
  Settings,
  LogOut,
  LogIn,
} from "lucide-react";

// Map category names to icons
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes("tent") || name.includes("lều")) return Tent;
  if (name.includes("clothes") || name.includes("áo") || name.includes("quần"))
    return Shirt;
  if (name.includes("shoes") || name.includes("giày") || name.includes("dép"))
    return Footprints;
  if (name.includes("pliers") || name.includes("kìm") || name.includes("tools"))
    return Settings;
  return Package;
};

function HeaderMain() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItemCount } = useCart();

  // Fetch categories for navigation
  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    GET_ALL_CATEGORIES,
    {
      variables: {
        orderBy: ["NAME_ASC"],
      },
    }
  );

  // Check if current path is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-background border-b">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>Hotline: 1900-XXX-XXX</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Miễn phí giao hàng toàn quốc</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/tracking" className="hover:underline">
              Tra cứu đơn hàng
            </Link>
            <Link to="/stores" className="hover:underline">
              Hệ thống cửa hàng
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">
                CF
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">CampFire</h1>
              <p className="text-xs text-muted-foreground">Outdoor Equipment</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
            </Button>

            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                title="Giỏ hàng"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Authentication Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {user?.username}
                  </span>
                  {user?.role === "admin" && (
                    <Badge variant="secondary" className="text-xs">
                      Admin
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  title="Đăng xuất"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="hidden md:flex"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Đăng nhập
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/login")}
                  className="md:hidden"
                  title="Đăng nhập"
                >
                  <LogIn className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-primary">
        <div className="container mx-auto px-4">
          <div className={`${isMenuOpen ? "block" : "hidden"} md:block`}>
            <ul className="flex flex-col md:flex-row md:items-center md:space-x-8 py-4 md:py-2">
              {/* Home */}
              <li>
                <Link
                  to="/"
                  className={`flex items-center gap-2 py-2 md:py-1 px-3 md:px-0 font-medium transition-colors ${
                    isActiveLink("/")
                      ? "text-accent bg-accent/10 md:bg-transparent border-b-2 border-accent"
                      : "text-primary-foreground hover:text-accent"
                  }`}
                >
                  Trang chủ
                </Link>
              </li>

              {/* Categories */}
              <li>
                <Link
                  to="/categories"
                  className={`flex items-center gap-2 py-2 md:py-1 px-3 md:px-0 font-medium transition-colors ${
                    isActiveLink("/categories")
                      ? "text-accent bg-accent/10 md:bg-transparent border-b-2 border-accent"
                      : "text-primary-foreground hover:text-accent"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                  Danh mục
                </Link>
              </li>

              {/* Products */}
              <li>
                <Link
                  to="/products"
                  className={`flex items-center gap-2 py-2 md:py-1 px-3 md:px-0 font-medium transition-colors ${
                    isActiveLink("/products")
                      ? "text-accent bg-accent/10 md:bg-transparent border-b-2 border-accent"
                      : "text-primary-foreground hover:text-accent"
                  }`}
                >
                  <Package className="h-4 w-4" />
                  Sản phẩm
                </Link>
              </li>

              {/* Dynamic Categories */}
              {!categoriesLoading &&
                categoriesData?.categories?.nodes?.map((category) => {
                  const IconComponent = getCategoryIcon(category.name);
                  const categoryPath = `/category/${category._id}`;

                  return (
                    <li key={category._id}>
                      <Link
                        to={categoryPath}
                        className={`flex items-center gap-2 py-2 md:py-1 px-3 md:px-0 font-medium transition-colors ${
                          isActiveLink(categoryPath)
                            ? "text-accent bg-accent/10 md:bg-transparent border-b-2 border-accent"
                            : "text-primary-foreground hover:text-accent"
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        {category.name}
                      </Link>
                    </li>
                  );
                })}

              {/* Loading placeholder for categories */}
              {categoriesLoading && (
                <>
                  {[1, 2, 3].map((i) => (
                    <li key={`loading-${i}`}>
                      <div className="flex items-center gap-2 py-2 md:py-1 px-3 md:px-0">
                        <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                    </li>
                  ))}
                </>
              )}

              {/* Additional Links */}
              <li className="md:ml-auto">
                <Link
                  to="/about"
                  className={`block py-2 md:py-1 px-3 md:px-0 font-medium transition-colors ${
                    isActiveLink("/about")
                      ? "text-accent bg-accent/10 md:bg-transparent border-b-2 border-accent"
                      : "text-primary-foreground hover:text-accent"
                  }`}
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`block py-2 md:py-1 px-3 md:px-0 font-medium transition-colors ${
                    isActiveLink("/contact")
                      ? "text-accent bg-accent/10 md:bg-transparent border-b-2 border-accent"
                      : "text-primary-foreground hover:text-accent"
                  }`}
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default HeaderMain;
