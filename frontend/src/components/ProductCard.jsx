import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Eye, Package } from "lucide-react";
import AddToCartButton from "./AddToCartButton.jsx";
import { getImageUrl } from "../lib/imageUtils.js";

function ProductCard({ product, viewMode = "grid" }) {
  const { _id, name, price, imageUrl, categoryName, manufacturerName } =
    product;

  // Mock rating data - sẽ thêm vào GraphQL schema sau
  const rating = 4.5;
  const reviewCount = 12;
  const isInStock = true;

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
          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-primary/50 text-primary" />
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-muted-foreground" />);
      }
    }
    return stars;
  };

  if (viewMode === "list") {
    return (
      <div className="group bg-card border-2 border-muted hover:border-primary/50 transition-all duration-300 cursor-pointer flex overflow-hidden rounded-lg">
        {/* Product Image */}
        <div className="w-64 flex-shrink-0 bg-gradient-to-br from-secondary/5 to-primary/5 overflow-hidden relative">
          {imageUrl ? (
            <img
              src={getImageUrl(imageUrl)}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary/10 to-primary/10 flex items-center justify-center">
              <div className="text-center">
                <Package className="h-12 w-12 text-primary/40 mx-auto mb-2" />
                <span className="text-primary/60 text-sm font-medium">
                  CampFire
                </span>
              </div>
            </div>
          )}

          {/* Overlay Actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" className="p-2">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between h-full">
            <div className="flex-1 mr-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="text-xs border-primary/20 text-primary"
                >
                  {categoryName}
                </Badge>
                {manufacturerName && (
                  <Badge variant="secondary" className="text-xs">
                    {manufacturerName}
                  </Badge>
                )}
              </div>

              <Link to={`/product/${_id}`}>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                  {name}
                </h3>
              </Link>

              <div className="flex items-center gap-1 mb-3">
                {renderStars(rating)}
                <span className="text-sm text-muted-foreground ml-1">
                  ({reviewCount})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(price)}
                </span>
              </div>

              <Button
                className="bg-primary hover:bg-primary/90"
                disabled={!isInStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isInStock ? "Thêm vào giỏ" : "Hết hàng"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-card border-2 border-muted hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden rounded-lg">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary/5 to-primary/5">
        {imageUrl ? (
          <img
            src={getImageUrl(imageUrl)}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary/10 to-primary/10 flex items-center justify-center">
            <div className="text-center">
              <Package className="h-12 w-12 text-primary/40 mx-auto mb-2" />
              <span className="text-primary/60 text-sm font-medium">
                CampFire
              </span>
            </div>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full"
            asChild
          >
            <Link to={`/product/${_id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {!isInStock && (
            <Badge variant="destructive" className="text-xs">
              Hết hàng
            </Badge>
          )}
          {categoryName && (
            <Badge
              variant="outline"
              className="text-xs border-primary/20 text-primary"
            >
              {categoryName}
            </Badge>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        {manufacturerName && (
          <p className="text-xs text-primary font-medium">{manufacturerName}</p>
        )}

        {/* Product Name */}
        <Link to={`/product/${_id}`}>
          <h3 className="font-bold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">{renderStars(rating)}</div>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {formatPrice(price)}
          </span>
        </div>

        {/* Add to Cart Button */}
        {isInStock ? (
          <AddToCartButton
            product={product}
            className="w-full bg-primary hover:bg-primary/90"
          />
        ) : (
          <Button className="w-full bg-muted text-muted-foreground" disabled>
            <Package className="h-4 w-4 mr-2" />
            Hết hàng
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
