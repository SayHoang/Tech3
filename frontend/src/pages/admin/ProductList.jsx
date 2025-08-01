import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertTriangle,
} from "lucide-react";
import {
  GET_ALL_PRODUCTS,
  GET_ALL_CATEGORIES,
  GET_ALL_MANUFACTURERS,
  DELETE_PRODUCT,
} from "../../graphql/admin/products.js";

function ProductList() {
  const navigate = useNavigate();

  // Filter and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedManufacturer, setSelectedManufacturer] = useState("all");
  const [sortBy, setSortBy] = useState("NAME_ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Build filter condition
  const filterCondition = {};
  if (debouncedSearchTerm) {
    filterCondition.name = debouncedSearchTerm;
  }
  if (selectedCategory && selectedCategory !== "all") {
    filterCondition.categoryId = selectedCategory;
  }
  if (selectedManufacturer && selectedManufacturer !== "all") {
    filterCondition.manufacturerId = selectedManufacturer;
  }

  // GraphQL queries
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery(GET_ALL_PRODUCTS, {
    variables: {
      first: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
      condition:
        Object.keys(filterCondition).length > 0 ? filterCondition : null,
      orderBy: [sortBy],
    },
    errorPolicy: "all",
  });

  const { data: categoriesData } = useQuery(GET_ALL_CATEGORIES, {
    variables: { orderBy: ["NAME_ASC"] },
  });

  const { data: manufacturersData } = useQuery(GET_ALL_MANUFACTURERS, {
    variables: { orderBy: ["NAME_ASC"] },
  });

  // Delete mutation
  const [deleteProduct, { loading: deleteLoading }] = useMutation(
    DELETE_PRODUCT,
    {
      update(cache, { data }) {
        if (data.deleteProduct === 1) {
          // Successfully deleted, refetch to update the list
          refetchProducts();
        }
      },
      onCompleted: (data) => {
        if (data.deleteProduct === 1) {
          alert("Xóa sản phẩm thành công!");
        } else {
          alert("Không tìm thấy sản phẩm để xóa!");
        }
      },
      onError: (error) => {
        console.error("Delete error:", error);
        alert("Có lỗi xảy ra khi xóa sản phẩm!");
      },
    }
  );

  // Handle delete
  const handleDelete = async (productId) => {
    try {
      await deleteProduct({ variables: { _id: productId } });
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedManufacturer("all");
    setSortBy("NAME_ASC");
    setCurrentPage(1);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Calculate pagination
  const totalProducts = productsData?.products?.totalCount || 0;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const products = productsData?.products?.nodes || [];
  const categories = categoriesData?.categories?.nodes || [];
  const manufacturers = manufacturersData?.manufacturers?.nodes || [];

  if (productsError) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Có lỗi xảy ra khi tải danh sách sản phẩm!</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
          <p className="text-gray-600 mt-1">
            Tổng số: {totalProducts} sản phẩm
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Thêm Sản phẩm
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc và Tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm tên sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Manufacturer filter */}
            <Select
              value={selectedManufacturer}
              onValueChange={setSelectedManufacturer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhà sản xuất" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả nhà sản xuất</SelectItem>
                {manufacturers.map((manufacturer) => (
                  <SelectItem key={manufacturer._id} value={manufacturer._id}>
                    {manufacturer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NAME_ASC">Tên A-Z</SelectItem>
                <SelectItem value="NAME_DESC">Tên Z-A</SelectItem>
                <SelectItem value="PRICE_ASC">Giá thấp đến cao</SelectItem>
                <SelectItem value="PRICE_DESC">Giá cao đến thấp</SelectItem>
                <SelectItem value="ID_DESC">Mới nhất</SelectItem>
                <SelectItem value="ID_ASC">Cũ nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={handleResetFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent>
          {productsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-gray-600">
                Thử thay đổi bộ lọc hoặc thêm sản phẩm mới.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hình ảnh</TableHead>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Nhà sản xuất</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <img
                          src={product.imageUrl || "/placeholder-product.png"}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded-md border"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-orange-600 font-medium">
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {product.categoryName || "Chưa có"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {product.manufacturerName || "Chưa có"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          Còn hàng
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/products/edit/${product._id}`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                disabled={deleteLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Xác nhận xóa
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa sản phẩm "
                                  {product.name}"? Hành động này không thể hoàn
                                  tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product._id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Xóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
            {Math.min(currentPage * itemsPerPage, totalProducts)} trong tổng số{" "}
            {totalProducts} sản phẩm
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </Button>

            <span className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!hasNextPage}
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
