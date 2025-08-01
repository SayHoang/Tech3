import { useQuery } from "@apollo/client";
import { useState, useEffect, useMemo } from "react";
import { GET_ALL_PRODUCTS } from "../graphql/products.js";
import { GET_ALL_CATEGORIES } from "../graphql/categories.js";
import { GET_ALL_MANUFACTURERS } from "../graphql/manufacturers.js";
import ProductCard from "../components/ProductCard.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  X,
  Grid,
  List,
  ArrowUpDown,
  Package,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("ID_DESC");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data
  const { data: categoriesData } = useQuery(GET_ALL_CATEGORIES);
  const { data: manufacturersData } = useQuery(GET_ALL_MANUFACTURERS);

  // Memoize the query variables to prevent unnecessary re-renders
  const queryVariables = useMemo(() => {
    const condition = {};

    if (debouncedSearchTerm) condition.name = debouncedSearchTerm;
    if (selectedCategory) condition.categoryId = selectedCategory;
    if (selectedManufacturer) condition.manufacturerId = selectedManufacturer;

    if (priceRange.min || priceRange.max) {
      condition.price = {};
      if (priceRange.min) condition.price.min = parseFloat(priceRange.min);
      if (priceRange.max) condition.price.max = parseFloat(priceRange.max);
    }

    return {
      first: 100, // Get more products for pagination
      offset: 0,
      condition: Object.keys(condition).length > 0 ? condition : undefined,
      orderBy: [sortBy],
    };
  }, [
    debouncedSearchTerm,
    selectedCategory,
    selectedManufacturer,
    priceRange.min,
    priceRange.max,
    sortBy,
  ]);

  const { data, loading, error } = useQuery(GET_ALL_PRODUCTS, {
    variables: queryVariables,
  });

  const categories = categoriesData?.categories?.nodes || [];
  const manufacturers = manufacturersData?.manufacturers?.nodes || [];
  const allProducts = data?.products?.nodes || [];

  // Client-side pagination
  const totalPages = Math.ceil(allProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = allProducts.slice(startIndex, endIndex);

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSelectedCategory("");
    setSelectedManufacturer("");
    setPriceRange({ min: "", max: "" });
    setSortBy("ID_DESC");
    setCurrentPage(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section Skeleton */}
        <div className="bg-secondary py-16">
          <div className="container mx-auto px-4">
            <div className="h-12 bg-gray-700 rounded w-96 mx-auto animate-pulse mb-4"></div>
            <div className="h-6 bg-gray-700 rounded w-64 mx-auto animate-pulse"></div>
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="bg-background py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="border-destructive bg-card max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <AlertCircle className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Lỗi tải sản phẩm</p>
              <p className="text-sm mb-4">{error.message}</p>
              <Button asChild>
                <Link to="/">Quay về trang chủ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - ChuyenTactical Style */}
      <section className="bg-background text-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Package className="h-12 w-12 text-primary mr-4" />
              <h1 className="text-5xl font-bold text-foreground">
                TẤT CẢ SẢN PHẨM
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Khám phá toàn bộ bộ sưu tập outdoor chuyên nghiệp của CampFire.
              <span className="text-primary font-semibold">
                {" "}
                Hơn {allProducts.length} sản phẩm
              </span>{" "}
              chất lượng cao từ các thương hiệu hàng đầu thế giới.
            </p>

            {/* Breadcrumb */}
            <nav className="text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground font-medium">Sản phẩm</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Filters and Products Section */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          {/* Search and Filters */}
          <Card className="bg-card border-2 border-muted mb-8">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  Tìm kiếm & Lọc sản phẩm
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-primary"
                >
                  <X className="h-4 w-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sản phẩm theo tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-muted focus:border-primary"
                />
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Danh mục
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border-2 border-muted rounded-md px-3 py-2 bg-background text-foreground"
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Manufacturer Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Thương hiệu
                  </label>
                  <select
                    value={selectedManufacturer}
                    onChange={(e) => setSelectedManufacturer(e.target.value)}
                    className="w-full border-2 border-muted rounded-md px-3 py-2 bg-background text-foreground"
                  >
                    <option value="">Tất cả thương hiệu</option>
                    {manufacturers.map((manufacturer) => (
                      <option key={manufacturer._id} value={manufacturer._id}>
                        {manufacturer.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Khoảng giá (VND)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Từ"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          min: e.target.value,
                        }))
                      }
                      className="border-2 border-muted"
                    />
                    <Input
                      type="number"
                      placeholder="Đến"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          max: e.target.value,
                        }))
                      }
                      className="border-2 border-muted"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sắp xếp theo
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border-2 border-muted rounded-md px-3 py-2 bg-background text-foreground"
                  >
                    <option value="ID_DESC">Mới nhất</option>
                    <option value="NAME_ASC">Tên A-Z</option>
                    <option value="NAME_DESC">Tên Z-A</option>
                    <option value="PRICE_ASC">Giá thấp đến cao</option>
                    <option value="PRICE_DESC">Giá cao đến thấp</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(debouncedSearchTerm ||
                selectedCategory ||
                selectedManufacturer ||
                priceRange.min ||
                priceRange.max) && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-muted">
                  {debouncedSearchTerm && (
                    <Badge variant="secondary" className="gap-1">
                      Tìm kiếm: "{debouncedSearchTerm}"
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => {
                          setSearchTerm("");
                          setDebouncedSearchTerm("");
                        }}
                      />
                    </Badge>
                  )}
                  {selectedCategory && (
                    <Badge variant="secondary" className="gap-1">
                      {categories.find((c) => c._id === selectedCategory)
                        ?.name || "Unknown Category"}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedCategory("")}
                      />
                    </Badge>
                  )}
                  {selectedManufacturer && (
                    <Badge variant="secondary" className="gap-1">
                      {manufacturers.find((m) => m._id === selectedManufacturer)
                        ?.name || "Unknown Manufacturer"}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedManufacturer("")}
                      />
                    </Badge>
                  )}
                  {(priceRange.min || priceRange.max) && (
                    <Badge variant="secondary" className="gap-1">
                      Giá: {formatPrice(priceRange.min || 0)} -{" "}
                      {formatPrice(priceRange.max || 999999999)}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setPriceRange({ min: "", max: "" })}
                      />
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground">
                Hiển thị{" "}
                <span className="text-primary font-semibold">
                  {currentProducts.length}
                </span>{" "}
                trong tổng số{" "}
                <span className="text-primary font-semibold">
                  {allProducts.length}
                </span>{" "}
                sản phẩm
              </p>
              {totalPages > 1 && (
                <p className="text-sm text-muted-foreground">
                  Trang {currentPage} / {totalPages}
                </p>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hiển thị:</span>
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
          {currentProducts.length === 0 ? (
            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="text-center py-16">
                  <Package className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
                  <p className="text-xl text-muted-foreground mb-4">
                    Không tìm thấy sản phẩm nào
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
                  </p>
                  <Button onClick={clearFilters}>Xóa tất cả bộ lọc</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {currentProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                const isCurrentPage = page === currentPage;
                return (
                  <Button
                    key={page}
                    variant={isCurrentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={isCurrentPage ? "bg-primary" : ""}
                  >
                    {page}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Sau
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Products;
