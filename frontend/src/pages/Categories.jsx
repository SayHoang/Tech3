import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "../graphql/categories.js";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tent,
  Shirt,
  Footprints,
  ChevronRight,
  Package,
  Grid3X3,
  Star,
  ShoppingBag,
  Headphones,
  Settings,
} from "lucide-react";

// Map category names to icons - theo style chuyentactical
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes("tent") || name.includes("lều")) return Tent;
  if (name.includes("clothes") || name.includes("áo") || name.includes("quần"))
    return Shirt;
  if (name.includes("shoes") || name.includes("giày") || name.includes("dép"))
    return Footprints;
  if (name.includes("pliers") || name.includes("kìm") || name.includes("tools"))
    return Settings;
  return Package;
};

// Map category names to product counts
const getCategoryCount = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes("tent")) return 18;
  if (name.includes("clothes")) return 19;
  if (name.includes("shoes")) return 18;
  if (name.includes("pliers")) return 18;
  return 20;
};

function Categories() {
  const { data, loading, error } = useQuery(GET_ALL_CATEGORIES, {
    variables: {
      orderBy: ["NAME_ASC"],
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary">
        {/* Hero Section Skeleton */}
        <div className="bg-secondary py-20">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4">
              <div className="h-12 bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
              <div className="h-6 bg-gray-700 rounded w-64 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Categories Grid Skeleton */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card border-gray-700 animate-pulse">
                <CardHeader>
                  <div className="h-20 bg-gray-700 rounded mb-4"></div>
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3 mx-auto"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Card className="border-destructive bg-card max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="text-lg font-semibold mb-2">Lỗi tải danh mục</p>
              <p className="text-sm mb-4">{error.message}</p>
              <Button asChild variant="outline">
                <Link to="/">Quay về trang chủ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section - Style chuyentactical với nền đen */}
      <section className="bg-secondary text-secondary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Grid3X3 className="h-12 w-12 text-primary mr-4" />
              <h1 className="text-5xl font-bold text-secondary-foreground">
                DANH MỤC SẢN PHẨM
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Khám phá bộ sưu tập đầy đủ các sản phẩm outdoor chuyên nghiệp. Từ{" "}
              <span className="text-primary font-semibold">lều trại</span>,
              <span className="text-primary font-semibold">
                {" "}
                trang phục tactical
              </span>{" "}
              đến
              <span className="text-primary font-semibold">
                {" "}
                giày dép outdoor
              </span>{" "}
              - Tất cả đều có tại CampFire.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">150+</div>
                <div className="text-sm text-muted-foreground">Sản phẩm</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">3</div>
                <div className="text-sm text-muted-foreground">
                  Danh mục chính
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Chính hãng</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid - Style chuyentactical */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {data.categories.nodes.length === 0 ? (
            <Card className="bg-card border-muted">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-xl text-muted-foreground mb-4">
                    Chưa có danh mục nào
                  </p>
                  <Button asChild>
                    <Link to="/">Quay về trang chủ</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.categories.nodes.map((category) => {
                const IconComponent = getCategoryIcon(category.name);
                const productCount = getCategoryCount(category.name);

                return (
                  <Link key={category._id} to={`/category/${category._id}`}>
                    <Card className="group bg-card border-2 border-muted hover:border-primary/50 transition-all duration-300 cursor-pointer h-full overflow-hidden">
                      <CardHeader className="text-center pb-4 relative">
                        {/* Background pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative">
                          <div className="mx-auto w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                            <IconComponent className="h-10 w-10 text-secondary-foreground group-hover:text-primary-foreground transition-colors" />
                          </div>

                          <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-3">
                            {category.name.toUpperCase()}
                          </CardTitle>

                          <div className="flex items-center justify-center gap-2 mb-4">
                            <Badge
                              variant="outline"
                              className="bg-secondary/20 border-primary/20 text-primary font-semibold"
                            >
                              {productCount} sản phẩm
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-primary fill-primary" />
                              <span className="text-sm text-muted-foreground">
                                4.8
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="text-center relative">
                        {/* Product preview area */}
                        <div className="h-40 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:from-secondary/20 group-hover:to-primary/20 transition-all duration-300 border border-muted">
                          <div className="text-center">
                            <IconComponent className="h-20 w-20 text-primary/60 group-hover:text-primary transition-colors mb-2" />
                            <span className="text-sm text-muted-foreground font-medium">
                              {category.name} Collection
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 font-semibold"
                        >
                          XEM BỘ SƯU TẬP
                          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action - Style chuyentactical */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-secondary to-secondary/90 border-primary/20 border-2">
            <CardContent className="pt-8 text-center">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold text-secondary-foreground mb-4">
                  CHƯA TÌM ĐƯỢC SẢN PHẨM PHÙ HỢP?
                </h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  Đội ngũ chuyên gia của CampFire sẵn sàng tư vấn và hỗ trợ bạn
                  tìm kiếm những sản phẩm outdoor phù hợp nhất với nhu cầu và
                  ngân sách.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Link to="/contact">
                      <Headphones className="mr-2 h-5 w-5" />
                      LIÊN HỆ TƯ VẤN
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Link to="/about">TÌM HIỂU THÊM</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default Categories;
