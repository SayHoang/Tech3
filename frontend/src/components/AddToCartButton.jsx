import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";
import { ShoppingCart, Plus, Minus, Check, Loader2 } from "lucide-react";

function AddToCartButton({
  product,
  quantity = 1,
  selectedSize = "",
  selectedColor = "",
  variant = "default",
  size = "default",
  className = "",
  showQuantityControls = false,
  onQuantityChange = null,
}) {
  const { isAuthenticated } = useAuth();
  const { addToCart, addingToCart } = useCart();
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync localQuantity with quantity prop changes
  useEffect(() => {
    setLocalQuantity(quantity);
  }, [quantity]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Show login prompt
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    try {
      // Create enhanced product object with selections
      const enhancedProduct = {
        ...product,
        selectedSize,
        selectedColor,
      };

      const result = await addToCart(enhancedProduct, localQuantity);

      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        alert(result.message || "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng");
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setLocalQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange(newQuantity);
    }
  };

  if (showSuccess) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`${className} border-green-500 text-green-600 hover:bg-green-50`}
        disabled
      >
        <Check className="h-4 w-4 mr-2" />
        Đã thêm vào giỏ
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {showQuantityControls && (
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleQuantityChange(localQuantity - 1)}
            disabled={localQuantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <div className="flex items-center justify-center min-w-[40px] h-8 text-sm font-medium">
            {localQuantity}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleQuantityChange(localQuantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      )}

      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleAddToCart}
        disabled={addingToCart || !product}
      >
        {addingToCart ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <ShoppingCart className="h-4 w-4 mr-2" />
        )}
        {addingToCart ? "Đang thêm..." : "Thêm vào giỏ"}
        {!showQuantityControls && localQuantity > 1 && (
          <Badge variant="secondary" className="ml-2 h-5">
            {localQuantity}
          </Badge>
        )}
      </Button>
    </div>
  );
}

export default AddToCartButton;
