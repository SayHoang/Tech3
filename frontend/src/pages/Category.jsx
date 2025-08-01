import { useQuery } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GET_PRODUCTS_BY_CATEGORY } from "../graphql/products.js";
import { CATEGORY_BY_ID } from "../graphql/categories.js";
import {
  ArrowLeft,
  Grid,
  List,
  Star,
  ShoppingCart,
  Filter,
  SortAsc,
  Heart,
  Package,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

function Category() {
  const { id } = useParams();
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("name_asc");

  // Fetch category info
  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
  } = useQuery(CATEGORY_BY_ID, {
    variables: { id },
    skip: !id,
  });

  // Fetch products in this category
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: {
      categoryId: id,
      first: 50,
      offset: 0,
    },
    skip: !id,
  });

  if (categoryLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-secondary">
        {/* Hero Section Skeleton */}
        <div className="bg-secondary py-16">
          <div className="container mx-auto px-4">
            <div className="h-8 w-32 bg-gray-700 rounded mb-4 animate-pulse"></div>
            <div className="h-12 w-64 bg-gray-700 rounded mb-2 animate-pulse"></div>
            <div className="h-6 w-48 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="bg-background py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="animate-pulse bg-card">
                  <CardHeader>
                    <div className="h-48 bg-gray-300 rounded mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (categoryError || productsError) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Card className="border-destructive bg-card max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <AlertCircle className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Lỗi tải dữ liệu</p>
              <p className="text-sm mb-4">
                {categoryError?.message || productsError?.message}
              </p>
              <Button asChild>
                <Link to="/categories">Quay lại danh mục</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const category = categoryData?.category;
  const products = productsData?.productsByCategory?.nodes || [];
  const totalProducts = productsData?.productsByCategory?.totalCount || 0;

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Style chuyentactical */}
      <section className="bg-secondary text-secondary-foreground py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <span>/</span>
              <Link
                to="/categories"
                className="hover:text-primary transition-colors"
              >
                Danh mục
              </Link>
              <span>/</span>
              <span className="text-secondary-foreground font-medium">
                {category?.name}
              </span>
            </div>
          </nav>

          <Button
            asChild
            variant="ghost"
            className="mb-6 -ml-4 text-muted-foreground hover:text-secondary-foreground"
          >
            <Link to="/categories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh mục
            </Link>
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-secondary-foreground mb-2">
                {category?.name?.toUpperCase()}
              </h1>
              <p className="text-muted-foreground text-lg">
                <span className="text-primary font-semibold">
                  {totalProducts}
                </span>{" "}
                sản phẩm chuyên nghiệp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Products Section */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          {/* Filters and View Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-card p-4 rounded-lg border">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-muted rounded-md px-3 py-2 bg-background text-foreground font-medium"
              >
                <option value="name_asc">Tên A-Z</option>
                <option value="name_desc">Tên Z-A</option>
                <option value="price_asc">Giá thấp đến cao</option>
                <option value="price_desc">Giá cao đến thấp</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">
                Hiển thị:
              </span>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products Display */}
          {sortedProducts.length === 0 ? (
            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="text-center py-16">
                  <Package className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
                  <p className="text-xl text-muted-foreground mb-4">
                    Chưa có sản phẩm nào trong danh mục này
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Chúng tôi đang cập nhật sản phẩm mới. Vui lòng quay lại sau.
                  </p>
                  <Button asChild>
                    <Link to="/categories">Xem danh mục khác</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {sortedProducts.map((product) => (
                <Card
                  key={product._id}
                  className={`group bg-card border-2 border-muted hover:border-primary/50 transition-all duration-300 cursor-pointer ${
                    viewMode === "list"
                      ? "flex flex-row overflow-hidden"
                      : "overflow-hidden"
                  }`}
                >
                  {/* Product Image */}
                  <div
                    className={`${
                      viewMode === "list" ? "w-64 flex-shrink-0" : "w-full"
                    } bg-gradient-to-br from-secondary/5 to-primary/5 overflow-hidden relative`}
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className={`${
                          viewMode === "list" ? "h-full" : "h-56"
                        } w-full object-cover group-hover:scale-110 transition-transform duration-500`}
                      />
                    ) : (
                      <div
                        className={`${
                          viewMode === "list" ? "h-full" : "h-56"
                        } w-full bg-gradient-to-br from-secondary/10 to-primary/10 flex items-center justify-center`}
                      >
                        <div className="text-center">
                          <Package className="h-12 w-12 text-primary/40 mx-auto mb-2" />
                          <span className="text-primary/60 text-sm font-medium">
                            CampFire
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" className="p-2">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div
                    className={`${viewMode === "list" ? "flex-1 p-6" : "p-4"}`}
                  >
                    <div
                      className={`${
                        viewMode === "list"
                          ? "flex items-center justify-between h-full"
                          : "space-y-3"
                      }`}
                    >
                      <div
                        className={`${
                          viewMode === "list" ? "flex-1 mr-6" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {product.categoryName && (
                            <Badge
                              variant="outline"
                              className="text-xs border-primary/20 text-primary"
                            >
                              {product.categoryName}
                            </Badge>
                          )}
                          {product.manufacturerName && (
                            <Badge variant="secondary" className="text-xs">
                              {product.manufacturerName}
                            </Badge>
                          )}
                        </div>

                        <h3
                          className={`${
                            viewMode === "list" ? "text-xl" : "text-lg"
                          } font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2`}
                        >
                          {product.name}
                        </h3>

                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-4 w-4 text-primary fill-primary"
                            />
                          ))}
                          <span className="text-sm text-muted-foreground ml-1">
                            (4.8)
                          </span>
                        </div>
                      </div>

                      <div
                        className={`${
                          viewMode === "list"
                            ? "flex items-center gap-4"
                            : "flex items-center justify-between"
                        }`}
                      >
                        <div className="text-right">
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(product.price)}
                          </span>
                        </div>

                        <Button
                          size={viewMode === "list" ? "default" : "sm"}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {viewMode === "list" ? "Thêm vào giỏ" : ""}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {totalProducts > sortedProducts.length && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Tải thêm sản phẩm
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Category;
