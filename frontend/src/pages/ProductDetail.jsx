import { useQuery } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  GET_PRODUCT_BY_ID,
  GET_PRODUCTS_BY_CATEGORY,
} from "../graphql/products.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ProductCard from "../components/ProductCard.jsx";
import AddToCartButton from "../components/AddToCartButton.jsx";
import WishlistButton from "../components/WishlistButton.jsx";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ZoomIn,
  ArrowLeft,
  Plus,
  Minus,
  Package,
  Shield,
  Truck,
  RotateCcw,
  AlertCircle,
  Check,
  X,
} from "lucide-react";

function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // Fetch product details
  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id },
    skip: !id,
  });

  // Fetch related products from same category
  const { data: relatedData } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: {
      categoryId: productData?.product?.categoryId,
      first: 4,
      offset: 0,
    },
    skip: !productData?.product?.categoryId,
  });

  const product = productData?.product;
  const relatedProducts =
    relatedData?.productsByCategory?.nodes?.filter((p) => p._id !== id) || [];

  // Mock data for features not in GraphQL yet
  const mockImages = [
    product?.imageUrl || "/api/placeholder/600/600",
    "/api/placeholder/600/600",
    "/api/placeholder/600/600",
  ];

  const mockSizes = ["S", "M", "L", "XL"];
  const mockColors = ["Đen", "Xám", "Xanh lá", "Cam"];

  // Set default values when component mounts or product changes
  useEffect(() => {
    if (mockSizes.length > 0 && !selectedSize) {
      setSelectedSize(mockSizes[1]); // Default to "M"
    }
    if (mockColors.length > 0 && !selectedColor) {
      setSelectedColor(mockColors[0]); // Default to "Đen"
    }
  }, [product, selectedSize, selectedColor]);
  const mockSpecs = {
    dimensions: "25 x 15 x 8 cm",
    material: "Cordura 1000D",
    weight: "850g",
    waterproof: "Có",
    warranty: "2 năm",
  };

  const mockReviews = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      rating: 5,
      comment: "Sản phẩm rất tốt, chất lượng vượt mong đợi!",
      date: "2024-01-15",
    },
    {
      id: 2,
      user: "Trần Thị B",
      rating: 4,
      comment: "Thiết kế đẹp, đúng như mô tả.",
      date: "2024-01-10",
    },
  ];

  const isInStock = true;
  const rating = 4.5;
  const reviewCount = 24;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-primary text-primary" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-primary/50 text-primary" />
        );
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-muted-foreground" />);
      }
    }
    return stars;
  };

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Skeleton */}
            <div className="animate-pulse">
              <div className="h-96 bg-gray-300 rounded-lg mb-4"></div>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 w-20 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>

            {/* Info Skeleton */}
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="h-12 bg-gray-300 rounded w-1/3"></div>
              <div className="h-24 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="border-destructive bg-card max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <AlertCircle className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">
                Không tìm thấy sản phẩm
              </p>
              <p className="text-sm mb-4">
                Sản phẩm này có thể đã bị xóa hoặc không tồn tại.
              </p>
              <Button asChild>
                <Link to="/products">Xem tất cả sản phẩm</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <section className="bg-muted py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link
              to="/products"
              className="hover:text-primary transition-colors"
            >
              Sản phẩm
            </Link>
            <span>/</span>
            <Link
              to={`/category/${product.categoryId}`}
              className="hover:text-primary transition-colors"
            >
              {product.categoryName || "Unknown Category"}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6 -ml-4" asChild>
            <Link to="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách sản phẩm
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-muted">
                <img
                  src={mockImages[activeImageIndex]}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isImageZoomed ? "scale-150" : "scale-100"
                  }`}
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-4 right-4"
                  onClick={() => setIsImageZoomed(!isImageZoomed)}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2">
                {mockImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-20 h-20 border-2 rounded-lg overflow-hidden transition-colors ${
                      index === activeImageIndex
                        ? "border-primary"
                        : "border-muted hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {product.categoryName && (
                    <Badge
                      variant="outline"
                      className="border-primary/20 text-primary"
                    >
                      {product.categoryName}
                    </Badge>
                  )}
                  {product.manufacturerName && (
                    <Badge variant="secondary">
                      {product.manufacturerName}
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {renderStars(rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {rating} ({reviewCount} đánh giá)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-4xl font-bold text-primary mb-6">
                  {formatPrice(product.price)}
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {isInStock ? (
                  <>
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-green-600 font-medium">Còn hàng</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-red-500" />
                    <span className="text-red-600 font-medium">Hết hàng</span>
                  </>
                )}
              </div>

              {/* Options */}
              <div className="space-y-4">
                {/* Size Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kích thước:
                  </label>
                  <div className="flex gap-2">
                    {mockSizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Màu sắc:
                  </label>
                  <div className="flex gap-2">
                    {mockColors.map((color) => (
                      <Button
                        key={color}
                        variant={
                          selectedColor === color ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số lượng:
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-20 text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-4">
                {isInStock ? (
                  <AddToCartButton
                    product={product}
                    quantity={quantity}
                    selectedSize={selectedSize}
                    selectedColor={selectedColor}
                    size="lg"
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onQuantityChange={setQuantity}
                  />
                ) : (
                  <Button
                    size="lg"
                    className="flex-1 bg-muted text-muted-foreground"
                    disabled
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Hết hàng
                  </Button>
                )}
                <WishlistButton productId={product._id} />
                <Button size="lg" variant="outline">
                  Mua ngay
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm">Bảo hành 2 năm</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-sm">Miễn phí vận chuyển</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <span className="text-sm">Đổi trả 7 ngày</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Description & Specs */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mô tả sản phẩm</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.name} là một sản phẩm outdoor chuyên nghiệp được
                      thiết kế để đáp ứng nhu cầu của những người yêu thích khám
                      phá thiên nhiên. Với chất liệu cao cấp và thiết kế tinh
                      tế, sản phẩm mang lại sự thoải mái và bền bỉ trong mọi
                      điều kiện thời tiết. Đặc biệt, sản phẩm được trang bị các
                      tính năng hiện đại giúp người dùng có trải nghiệm tốt nhất
                      khi sử dụng. Phù hợp cho các hoạt động như cắm trại, leo
                      núi, trekking và nhiều hoạt động outdoor khác.
                    </p>
                  </CardContent>
                </Card>

                {/* Specifications */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông số kỹ thuật</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(mockSpecs).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b border-muted"
                        >
                          <span className="font-medium capitalize">
                            {key === "dimensions" && "Kích thước"}
                            {key === "material" && "Chất liệu"}
                            {key === "weight" && "Trọng lượng"}
                            {key === "waterproof" && "Chống nước"}
                            {key === "warranty" && "Bảo hành"}
                          </span>
                          <span className="text-muted-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews */}
                <Card>
                  <CardHeader>
                    <CardTitle>Đánh giá khách hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {mockReviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-muted pb-4 last:border-b-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.user}</span>
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {review.date}
                          </span>
                        </div>
                        <p className="text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Related Products */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Sản phẩm liên quan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedProducts.slice(0, 3).map((relatedProduct) => (
                      <div
                        key={relatedProduct._id}
                        className="border border-muted rounded-lg p-3"
                      >
                        <Link to={`/product/${relatedProduct._id}`}>
                          <div className="flex gap-3">
                            <img
                              src={
                                relatedProduct.imageUrl ||
                                "/api/placeholder/80/80"
                              }
                              alt={relatedProduct.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                                {relatedProduct.name}
                              </h4>
                              <p className="text-primary font-bold text-sm mt-1">
                                {formatPrice(relatedProduct.price)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;
