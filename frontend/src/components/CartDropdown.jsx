import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "../hooks/useCart.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  Package,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

function CartDropdown() {
  const { isAuthenticated } = useAuth();
  const {
    cartItems,
    cartTotal,
    cartItemCount,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    updatingQuantity,
    removingFromCart,
    clearingCart,
  } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (!isCartOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50" onClick={closeCart}>
        <div
          className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl transform transition-transform duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="h-full rounded-none border-0">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Giỏ hàng của bạn
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={closeCart}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Đăng nhập để xem giỏ hàng
                </h3>
                <p className="text-muted-foreground mb-4">
                  Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng
                </p>
                <Link to="/login" onClick={closeCart}>
                  <Button>Đăng nhập ngay</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50" onClick={closeCart}>
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="h-full rounded-none border-0 flex flex-col">
          {/* Header */}
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Giỏ hàng của bạn
                {cartItemCount > 0 && (
                  <Badge variant="secondary">{cartItemCount}</Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={closeCart}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
            {cartItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Giỏ hàng trống</h3>
                  <p className="text-muted-foreground mb-4">
                    Chưa có sản phẩm nào trong giỏ hàng của bạn
                  </p>
                  <Link to="/products" onClick={closeCart}>
                    <Button>
                      Khám phá sản phẩm
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-4 p-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex gap-3 p-3 border rounded-lg"
                      >
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {item.productImageUrl ? (
                            <img
                              src={item.productImageUrl}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            {item.productName}
                          </h4>
                          <p className="text-primary font-bold text-sm">
                            {formatPrice(item.productPrice)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border rounded">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity - 1
                                  )
                                }
                                disabled={
                                  item.quantity <= 1 || updatingQuantity
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <div className="flex items-center justify-center min-w-[32px] h-7 text-xs font-medium">
                                {item.quantity}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity + 1
                                  )
                                }
                                disabled={updatingQuantity}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                              onClick={() => removeFromCart(item.productId)}
                              disabled={removingFromCart}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t p-4 space-y-4">
                  {/* Total */}
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button className="w-full" size="lg">
                      Thanh toán
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <div className="flex gap-2">
                      <Link to="/cart" className="flex-1" onClick={closeCart}>
                        <Button variant="outline" className="w-full">
                          Xem giỏ hàng
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={clearCart}
                        disabled={clearingCart}
                        title="Xóa tất cả"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CartDropdown;
