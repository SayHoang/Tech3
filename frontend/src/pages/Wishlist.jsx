import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  ShoppingCart,
  Heart,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { useWishlist } from "../hooks/useWishlist";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../lib/imageUtils.js";

function Wishlist() {
  const { isAuthenticated } = useAuth();
  const {
    wishlistItems,
    wishlistCount,
    wishlistLoading,
    handleRemoveFromWishlist,
    handleClearWishlist,
    handleMoveToCart,
    handleReorderWishlist,
    reorderLoading,
  } = useWishlist();

  // Local state for managing item order
  const [localItems, setLocalItems] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Update local items when wishlist items change
  useEffect(() => {
    setLocalItems(wishlistItems);
    setHasChanges(false);
  }, [wishlistItems]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const moveItemUp = (index) => {
    if (index === 0) return;

    const newItems = [...localItems];
    [newItems[index - 1], newItems[index]] = [
      newItems[index],
      newItems[index - 1],
    ];
    setLocalItems(newItems);
    setHasChanges(true);
  };

  const moveItemDown = (index) => {
    if (index === localItems.length - 1) return;

    const newItems = [...localItems];
    [newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ];
    setLocalItems(newItems);
    setHasChanges(true);
  };

  const saveOrder = async () => {
    const productIds = localItems.map((item) => item.productId);
    await handleReorderWishlist(productIds);
    setHasChanges(false);
  };

  const resetOrder = () => {
    setLocalItems(wishlistItems);
    setHasChanges(false);
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
        <div className="flex gap-2">
          {hasChanges && (
            <>
              <Button
                variant="outline"
                onClick={resetOrder}
                disabled={reorderLoading}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Hoàn tác
              </Button>
              <Button
                onClick={saveOrder}
                disabled={reorderLoading}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Lưu thứ tự
              </Button>
            </>
          )}
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
        <div className="space-y-4">
          {localItems.map((item, index) => (
            <Card
              key={item._id}
              className="group hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  {/* Order Controls */}
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveItemUp(index)}
                      disabled={index === 0}
                      className="h-8 w-8"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-500 text-center min-w-[2rem]">
                      {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveItemDown(index)}
                      disabled={index === localItems.length - 1}
                      className="h-8 w-8"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={getImageUrl(item.product.imageUrl)}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {item.product.name}
                        </h3>
                        <p className="text-xl font-bold text-orange-600 mt-1">
                          {formatCurrency(item.product.price)}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          {item.product.categoryName && (
                            <Badge variant="outline">
                              {item.product.categoryName}
                            </Badge>
                          )}
                          {item.product.manufacturerName && (
                            <Badge variant="secondary">
                              {item.product.manufacturerName}
                            </Badge>
                          )}
                          <span>Thêm ngày: {formatDate(item.addedAt)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleMoveToCart(item.productId)}
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Thêm vào giỏ
                        </Button>
                        <Link to={`/product/${item.productId}`}>
                          <Button variant="outline" size="sm">
                            Chi tiết
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveFromWishlist(item.productId)
                          }
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
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
