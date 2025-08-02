import { useQuery, useMutation } from "@apollo/client";
import { useAuth } from "../context/AuthContext";
import {
  GET_WISHLIST,
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  CLEAR_WISHLIST,
  MOVE_WISHLIST_TO_CART,
  REORDER_WISHLIST,
} from "../graphql/wishlist.js";
import { GET_CART, GET_CART_ITEM_COUNT } from "../graphql/cart.js";

export function useWishlist() {
  const { isAuthenticated } = useAuth();

  // Get wishlist data
  const {
    data: wishlistData,
    loading: wishlistLoading,
    error: wishlistError,
    refetch: refetchWishlist,
  } = useQuery(GET_WISHLIST, {
    skip: !isAuthenticated,
    errorPolicy: "all",
  });

  // Add to wishlist mutation
  const [addToWishlist, { loading: addLoading }] = useMutation(
    ADD_TO_WISHLIST,
    {
      update(cache, { data }) {
        if (data?.addToWishlist) {
          cache.writeQuery({
            query: GET_WISHLIST,
            data: { wishlist: data.addToWishlist },
          });
        }
      },
      onCompleted() {
        // Force refetch after successful add
        refetchWishlist();
      },
    }
  );

  // Remove from wishlist mutation
  const [removeFromWishlist, { loading: removeLoading }] = useMutation(
    REMOVE_FROM_WISHLIST,
    {
      update(cache, { data }) {
        if (data?.removeFromWishlist) {
          cache.writeQuery({
            query: GET_WISHLIST,
            data: { wishlist: data.removeFromWishlist },
          });
        }
      },
      onCompleted() {
        // Force refetch after successful remove
        refetchWishlist();
      },
    }
  );

  // Clear wishlist mutation
  const [clearWishlist, { loading: clearLoading }] = useMutation(
    CLEAR_WISHLIST,
    {
      update(cache, { data }) {
        if (data?.clearWishlist) {
          cache.writeQuery({
            query: GET_WISHLIST,
            data: { wishlist: data.clearWishlist },
          });
        }
      },
      onCompleted() {
        // Force refetch after successful clear
        refetchWishlist();
      },
    }
  );

  // Move to cart mutation
  const [moveToCart, { loading: moveLoading }] = useMutation(
    MOVE_WISHLIST_TO_CART,
    {
      update(cache, { data }) {
        if (data?.moveWishlistToCart) {
          // Update cart cache with new cart data
          cache.writeQuery({
            query: GET_CART,
            data: { cart: data.moveWishlistToCart },
          });

          // Update cart item count cache
          cache.writeQuery({
            query: GET_CART_ITEM_COUNT,
            data: { cartItemCount: data.moveWishlistToCart.totalItems },
          });
        }
      },
      onCompleted() {
        // Refetch wishlist to get updated data after moving to cart
        refetchWishlist();
      },
    }
  );

  // Reorder wishlist mutation
  const [reorderWishlist, { loading: reorderLoading }] = useMutation(
    REORDER_WISHLIST,
    {
      update(cache, { data }) {
        if (data?.reorderWishlist) {
          cache.writeQuery({
            query: GET_WISHLIST,
            data: { wishlist: data.reorderWishlist },
          });
        }
      },
    }
  );

  // Check if product is in wishlist
  const checkWishlistStatus = (productId) => {
    if (!isAuthenticated || !productId || !wishlistData?.wishlist) {
      return false;
    }
    return wishlistData.wishlist.items.some(
      (item) => item.productId === productId
    );
  };

  // Handle add to wishlist
  const handleAddToWishlist = async (productId) => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
      return;
    }

    // Check if already in wishlist to prevent duplicate
    if (checkWishlistStatus(productId)) {
      alert("Sản phẩm đã có trong danh sách yêu thích!");
      return;
    }

    try {
      await addToWishlist({ variables: { productId } });
      alert("Đã thêm vào danh sách yêu thích!");
    } catch (error) {
      console.error("Add to wishlist error:", error);
      if (error.message?.includes("already in wishlist")) {
        alert("Sản phẩm đã có trong danh sách yêu thích!");
        // Refetch to sync cache on error
        refetchWishlist();
      } else {
        alert("Có lỗi xảy ra khi thêm vào danh sách yêu thích!");
      }
    }
  };

  // Handle remove from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist({ variables: { productId } });
      alert("Đã xóa khỏi danh sách yêu thích!");
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      alert("Có lỗi xảy ra khi xóa khỏi danh sách yêu thích!");
      // Refetch to sync cache even on error
      refetchWishlist();
    }
  };

  // Handle clear wishlist
  const handleClearWishlist = async () => {
    if (
      confirm("Bạn có chắc muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?")
    ) {
      try {
        await clearWishlist();
        alert("Đã xóa tất cả sản phẩm khỏi danh sách yêu thích!");
      } catch (error) {
        console.error("Clear wishlist error:", error);
        alert("Có lỗi xảy ra khi xóa danh sách yêu thích!");
      }
    }
  };

  // Handle move to cart
  const handleMoveToCart = async (productId) => {
    try {
      await moveToCart({ variables: { productId } });
      alert("Đã chuyển sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Move to cart error:", error);
      alert("Có lỗi xảy ra khi chuyển vào giỏ hàng!");
    }
  };

  // Handle reorder wishlist
  const handleReorderWishlist = async (productIds) => {
    try {
      await reorderWishlist({ variables: { productIds } });
    } catch (error) {
      console.error("Reorder wishlist error:", error);
      alert("Có lỗi xảy ra khi sắp xếp lại danh sách yêu thích!");
    }
  };

  return {
    // Data
    wishlist: wishlistData?.wishlist,
    wishlistItems: wishlistData?.wishlist?.items || [],
    wishlistCount: wishlistData?.wishlist?.itemCount || 0,

    // Loading states
    wishlistLoading,
    addLoading,
    removeLoading,
    clearLoading,
    moveLoading,
    reorderLoading,

    // Error
    wishlistError,

    // Functions
    checkWishlistStatus,
    handleAddToWishlist,
    handleRemoveFromWishlist,
    handleClearWishlist,
    handleMoveToCart,
    handleReorderWishlist,
    refetchWishlist,
  };
}
