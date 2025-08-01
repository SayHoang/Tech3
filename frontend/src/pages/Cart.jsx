import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Cart() {
  const { isAuthenticated } = useAuth();
  const {
    cart,
    cartItems,
    cartTotal,
    cartLoading,
    updatingQuantity,
    removingFromCart,
    clearingCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartError,
  } = useCart();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Handle quantity update
  const handleQuantityUpdate = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  // Handle remove item
  const handleRemoveItem = async (productId) => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")
    ) {
      try {
        await removeFromCart(productId);
      } catch (error) {
        console.error("❌ Error removing item:", error);
        alert("Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại!");
      }
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?")
    ) {
      await clearCart();
    }
  };

  // Error state
  if (cartError) {
    console.error("Cart Error:", cartError);
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle>Lỗi tải giỏ hàng</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Có lỗi xảy ra khi tải giỏ hàng. Vui lòng thử lại!
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Tải lại trang
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải giỏ hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle>Bạn cần đăng nhập</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Vui lòng đăng nhập để xem giỏ hàng của bạn.
            </p>
            <Link to="/login">
              <Button className="w-full">
                Đăng nhập
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty cart
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle>Giỏ hàng trống</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng.
            </p>
            <Link to="/products">
              <Button className="w-full">
                Tiếp tục mua sắm
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
          <Button
            variant="outline"
            onClick={handleClearCart}
            disabled={clearingCart}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {clearingCart ? "Đang xóa..." : "Xóa tất cả"}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.productId} className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.productImageUrl || "/placeholder-product.png"}
                      alt={item.productName}
                      className="h-20 w-20 object-cover rounded-md border"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {item.productName}
                    </h3>

                    {/* Size & Color Info */}
                    {(item.selectedSize || item.selectedColor) && (
                      <div className="flex gap-2 mt-1">
                        {item.selectedSize && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Size: {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Màu: {item.selectedColor}
                          </span>
                        )}
                      </div>
                    )}

                    <p className="text-orange-600 font-medium mt-1">
                      {formatCurrency(item.productPrice)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Tổng: {formatCurrency(item.productPrice * item.quantity)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleQuantityUpdate(item.productId, item.quantity - 1)
                      }
                      disabled={updatingQuantity || item.quantity <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <span className="min-w-[40px] text-center font-medium">
                      {item.quantity}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleQuantityUpdate(item.productId, item.quantity + 1)
                      }
                      disabled={updatingQuantity}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.productId)}
                    disabled={removingFromCart}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Số lượng sản phẩm:</span>
                  <span>{cart?.totalItems || 0}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng:</span>
                    <span className="text-orange-600">
                      {formatCurrency(cartTotal)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button className="w-full" size="lg">
                    Tiến hành thanh toán
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Link to="/products">
                    <Button variant="outline" className="w-full">
                      Tiếp tục mua sắm
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
