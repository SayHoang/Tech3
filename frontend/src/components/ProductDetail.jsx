import { useQuery } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import { GET_PRODUCT_BY_ID } from "../graphql/products.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  Award,
  ChevronLeft,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import { useState } from "react";

function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id },
  });

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

  const product = data?.product;

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm</p>
        <Button asChild className="mt-4">
          <Link to="/products">Quay lại danh sách sản phẩm</Link>
        </Button>
      </div>
    );
  }

  const { name, price, imageUrl, categoryName, manufacturerName } = product;

  // Mock data - sẽ thêm vào GraphQL schema sau
  const rating = 4.5;
  const reviewCount = 24;
  const isInStock = true;
  const stockCount = 15;
  const images = [imageUrl || "/api/placeholder/600/600"];
  const description = `
    Sản phẩm outdoor chất lượng cao từ thương hiệu ${manufacturerName}. 
    Được thiết kế đặc biệt cho những hoạt động dã ngoại khắc nghiệt.
    Chất liệu bền bỉ, chống nước và chống va đập.
  `;

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
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="w-5 h-5 fill-yellow-400/50 text-yellow-400"
          />
        );
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
      }
    }
    return stars;
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= stockCount) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-primary">
              Trang chủ
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="text-gray-600 hover:text-primary">
              Sản phẩm
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/products">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Quay lại danh sách sản phẩm
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border">
              <img
                src={images[selectedImage]}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Category */}
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{categoryName}</Badge>
              <Badge variant="outline">{manufacturerName}</Badge>
            </div>

            {/* Product Name */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center">{renderStars(rating)}</div>
                <span className="text-gray-600">
                  {rating} ({reviewCount} đánh giá)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-b py-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {formatPrice(price)}
              </div>
              <div className="flex items-center gap-2">
                {isInStock ? (
                  <>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Còn hàng
                    </Badge>
                    <span className="text-gray-600">
                      ({stockCount} sản phẩm có sẵn)
                    </span>
                  </>
                ) : (
                  <Badge variant="destructive">Hết hàng</Badge>
                )}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium">Số lượng:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= stockCount}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  size="lg"
                  disabled={!isInStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Thêm vào giỏ hàng
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-6 border-t">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-green-600" />
                <span>Miễn phí vận chuyển đơn hàng trên 2 triệu</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Bảo hành chính hãng 2 năm</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Award className="h-5 w-5 text-orange-600" />
                <span>Cam kết hàng chính hãng 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description & Reviews */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Mô tả sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{description}</p>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-3">Đặc điểm nổi bật:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Chất liệu cao cấp, bền bỉ với thời gian</li>
                    <li>Thiết kế ergonomic, phù hợp cho hoạt động outdoor</li>
                    <li>Chống nước IPX7, hoạt động tốt trong mọi điều kiện thời tiết</li>
                    <li>Bảo hành chính hãng từ nhà sản xuất</li>
                    <li>Hướng dẫn sử dụng chi tiết bằng tiếng Việt</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Products */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm liên quan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock related products */}
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Sản phẩm liên quan {item}</h4>
                        <p className="text-primary font-semibold text-sm">1.200.000 VND</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;