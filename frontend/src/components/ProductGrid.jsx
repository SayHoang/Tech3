import { useQuery } from "@apollo/client";
import {
  GET_ALL_PRODUCTS,
  GET_PRODUCTS_BY_CATEGORY,
} from "../graphql/products.js";
import { GET_ALL_CATEGORIES } from "../graphql/categories.js";
import { GET_ALL_MANUFACTURERS } from "../graphql/manufacturers.js";
import ProductCard from "./ProductCard.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Filter, X, Search } from "lucide-react";
import { useState, useMemo } from "react";

function ProductGrid({ categoryId, limit = 12, showFilters = true }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("ID_DESC");

  // Fetch data
  const { data: categoriesData } = useQuery(GET_ALL_CATEGORIES);
  const { data: manufacturersData } = useQuery(GET_ALL_MANUFACTURERS);

  const { data, loading, error, refetch } = useQuery(
    selectedCategory ? GET_PRODUCTS_BY_CATEGORY : GET_ALL_PRODUCTS,
    {
      variables: selectedCategory
        ? {
            categoryId: selectedCategory,
            first: limit,
            offset: 0,
          }
        : {
            first: limit,
            offset: 0,
            condition: {
              name: searchTerm || undefined,
              price:
                priceRange.min || priceRange.max
                  ? {
                      min: priceRange.min
                        ? parseFloat(priceRange.min)
                        : undefined,
                      max: priceRange.max
                        ? parseFloat(priceRange.max)
                        : undefined,
                    }
                  : undefined,
            },
            orderBy: [sortBy],
          },
    }
  );

  const categories = categoriesData?.categories?.nodes || [];
  const manufacturers = manufacturersData?.manufacturers?.nodes || [];

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedManufacturer("");
    setPriceRange({ min: "", max: "" });
    setSortBy("ID_DESC");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Đang tải sản phẩm...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-medium">
          Có lỗi xảy ra khi tải sản phẩm
        </p>
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  const products = data?.products?.nodes || [];

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Không có sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Bộ lọc sản phẩm
            </h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Xóa bộ lọc
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Manufacturer Filter */}
            <select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Tất cả thương hiệu</option>
              {manufacturers.map((manufacturer) => (
                <option key={manufacturer._id} value={manufacturer._id}>
                  {manufacturer.name}
                </option>
              ))}
            </select>

            {/* Price Range */}
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Giá từ"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                }
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Giá đến"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                }
                className="w-full"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="ID_DESC">Mới nhất</option>
              <option value="ID_ASC">Cũ nhất</option>
              <option value="NAME_ASC">Tên A-Z</option>
              <option value="NAME_DESC">Tên Z-A</option>
              <option value="PRICE_ASC">Giá thấp đến cao</option>
              <option value="PRICE_DESC">Giá cao đến thấp</option>
            </select>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Tìm kiếm: {searchTerm}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSearchTerm("")}
                />
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                Danh mục:{" "}
                {categories.find((c) => c._id === selectedCategory)?.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedCategory("")}
                />
              </Badge>
            )}
            {selectedManufacturer && (
              <Badge variant="secondary" className="gap-1">
                Thương hiệu:{" "}
                {
                  manufacturers.find((m) => m._id === selectedManufacturer)
                    ?.name
                }
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedManufacturer("")}
                />
              </Badge>
            )}
            {(priceRange.min || priceRange.max) && (
              <Badge variant="secondary" className="gap-1">
                Giá: {priceRange.min || "0"} - {priceRange.max || "∞"} VND
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setPriceRange({ min: "", max: "" })}
                />
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Hiển thị {products.length} sản phẩm
          {data?.products?.totalCount &&
            ` trong tổng số ${data.products.totalCount}`}
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
