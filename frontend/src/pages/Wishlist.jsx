import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import { useWishlist } from "../hooks/useWishlist";
import { useAuth } from "../context/AuthContext";

function Wishlist() {
  const { isAuthenticated } = useAuth();
  const {
    wishlistItems,
    wishlistCount,
    wishlistLoading,
    handleRemoveFromWishlist,
    handleClearWishlist,
    handleMoveToCart,
  } = useWishlist();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Danh sách yêu thích
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng đăng nhập để xem danh sách yêu thích của bạn
          </p>
          <Link to="/login">
            <Button>Đăng nhập</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (wishlistLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Danh sách yêu thích
            </h1>
            <p className="text-gray-600">
              {wishlistCount} sản phẩm trong danh sách yêu thích
            </p>
          </div>
        </div>
        {wishlistCount > 0 && (
          <Button
            variant="outline"
            onClick={handleClearWishlist}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* Wishlist Items */}
      {wishlistCount === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Danh sách yêu thích trống
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa có sản phẩm nào trong danh sách yêu thích
            </p>
            <Link to="/products">
              <Button>Khám phá sản phẩm</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card
              key={item._id}
              className="group hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="relative">
                  <img
                    src={item.product.imageUrl || "/placeholder-product.jpg"}
                    alt={item.product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {item.product.name}
                  </h3>
                  <p className="text-lg font-bold text-orange-600">
                    {formatCurrency(item.product.price)}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Thêm ngày: {formatDate(item.addedAt)}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleMoveToCart(item.productId)}
                    className="flex-1"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Thêm vào giỏ
                  </Button>
                  <Link to={`/product/${item.productId}`}>
                    <Button variant="outline" size="sm">
                      Chi tiết
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
