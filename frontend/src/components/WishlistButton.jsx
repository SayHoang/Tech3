import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useWishlist } from "../hooks/useWishlist";

function WishlistButton({ productId, className = "" }) {
  const {
    checkWishlistStatus,
    handleAddToWishlist,
    handleRemoveFromWishlist,
    addLoading,
    removeLoading,
  } = useWishlist();

  const isInWishlist = checkWishlistStatus(productId);
  const isLoading = addLoading || removeLoading;

  const handleToggleWishlist = async () => {
    if (isLoading) return; // Prevent double-click

    if (isInWishlist) {
      await handleRemoveFromWishlist(productId);
    } else {
      await handleAddToWishlist(productId);
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleWishlist}
        disabled={isLoading}
        className={`hover:bg-red-50 ${className} ${
          isLoading ? "opacity-50" : ""
        }`}
        title={
          isLoading
            ? "Đang xử lý..."
            : isInWishlist
            ? "Xóa khỏi danh sách yêu thích"
            : "Thêm vào danh sách yêu thích"
        }
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            isInWishlist
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </Button>
      <span className="text-sm">Yêu thích</span>
    </div>
  );
}

export default WishlistButton;
