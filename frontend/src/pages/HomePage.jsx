import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "../graphql/categories.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductGrid from "../components/ProductGrid.jsx";
import { Link } from "react-router-dom";
import {
  Mountain,
  Tent,
  Shirt,
  Footprints,
  ArrowRight,
  Star,
  Truck,
  Award,
  Headphones,
  Shield,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Package,
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

function HomePage() {
  const { data: categoriesData } = useQuery(GET_ALL_CATEGORIES);
  const categories = categoriesData?.categories?.nodes || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Style chuyentactical với nền đen */}
      <section className="bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/98 to-secondary/95"></div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-primary/30 rotate-45"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-primary/20 rotate-12"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-primary/15"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-primary/20 text-primary border-primary/30 font-semibold px-4 py-2">
                  🔥 OUTDOOR EQUIPMENT CHUYÊN NGHIỆP
                </Badge>

                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="text-secondary-foreground">CAMPFIRE</span>
                  <br />
                  <span className="text-primary">OUTDOOR</span>
                </h1>

                <p className="text-xl lg:text-2xl text-muted-foreground max-w-xl">
                  Khám phá thiên nhiên với những thiết bị outdoor chuyên nghiệp
                  hàng đầu.
                  <span className="text-primary font-semibold">
                    {" "}
                    Chất lượng quân đội
                  </span>
                  ,
                  <span className="text-primary font-semibold">
                    {" "}
                    độ bền vượt trội
                  </span>
                  .
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 text-lg"
                >
                  <Link to="/categories">
                    <Mountain className="mr-2 h-6 w-6" />
                    KHÁM PHÁ NGAY
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold px-8 py-4 text-lg"
                >
                  <Link to="/contact">
                    <Phone className="mr-2 h-6 w-6" />
                    TƯ VẤN MIỄN PHÍ
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-primary/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    500+
                  </div>
                  <div className="text-sm text-muted-foreground">Sản phẩm</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    10K+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Khách hàng
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    99%
                  </div>
                  <div className="text-sm text-muted-foreground">Hài lòng</div>
                </div>
              </div>
            </div>

            {/* Right Content - Featured Categories */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-secondary-foreground mb-6">
                DANH MỤC NỔI BẬT
              </h3>
              <div className="grid gap-4">
                {categories.slice(0, 3).map((category) => {
                  const IconComponent = getCategoryIcon(category.name);
                  return (
                    <Link key={category._id} to={`/category/${category._id}`}>
                      <Card className="group bg-card border-2 border-muted hover:border-primary/50 transition-all duration-300 cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                              <IconComponent className="h-8 w-8 text-secondary-foreground group-hover:text-primary-foreground transition-colors" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                {category.name.toUpperCase()}
                              </h4>
                              <p className="text-muted-foreground">
                                30+ sản phẩm chuyên nghiệp
                              </p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              BỘ SƯU TẬP CHUYÊN NGHIỆP
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Từ{" "}
              <span className="text-primary font-semibold">
                lều trại tactical
              </span>{" "}
              đến
              <span className="text-primary font-semibold">
                {" "}
                trang phục combat
              </span>{" "}
              và
              <span className="text-primary font-semibold">
                {" "}
                giày dép outdoor
              </span>{" "}
              - Tất cả đều được tuyển chọn kỹ lưỡng từ các thương hiệu hàng đầu
              thế giới.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category.name);
              return (
                <Link key={category._id} to={`/category/${category._id}`}>
                  <Card className="group bg-card border-2 border-muted hover:border-primary/50 transition-all duration-300 cursor-pointer h-full">
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                        <IconComponent className="h-12 w-12 text-secondary-foreground group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {category.name.toUpperCase()}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="w-fit mx-auto border-primary/20 text-primary"
                      >
                        30+ sản phẩm
                      </Badge>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 font-semibold"
                      >
                        XEM BỘ SƯU TẬP
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-bold text-secondary-foreground mb-4">
                SẢN PHẨM NỔI BẬT
              </h2>
              <p className="text-xl text-muted-foreground">
                Những sản phẩm được yêu thích nhất bởi cộng đồng outdoor Việt
                Nam
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Link to="/products">
                XEM TẤT CẢ
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <ProductGrid limit={8} />
        </div>
      </section>

      {/* Features Section - Style chuyentactical */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              TẠI SAO CHỌN CAMPFIRE?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến những sản phẩm outdoor chất lượng nhất
              với dịch vụ hoàn hảo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center bg-card border-2 border-muted hover:border-primary/50 transition-all duration-300">
              <CardContent className="pt-8">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  CHÍNH HÃNG 100%
                </h3>
                <p className="text-muted-foreground">
                  Cam kết hàng chính hãng từ các thương hiệu outdoor hàng đầu
                  thế giới
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-card border-2 border-muted hover:border-primary/50 transition-all duration-300">
              <CardContent className="pt-8">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  MIỄN PHÍ VẬN CHUYỂN
                </h3>
                <p className="text-muted-foreground">
                  Free ship toàn quốc cho đơn hàng trên 2 triệu đồng
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-card border-2 border-muted hover:border-primary/50 transition-all duration-300">
              <CardContent className="pt-8">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  BẢO HÀNH DÀI HẠN
                </h3>
                <p className="text-muted-foreground">
                  Chính sách bảo hành lên đến 5 năm cho các sản phẩm chính hãng
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-card border-2 border-muted hover:border-primary/50 transition-all duration-300">
              <CardContent className="pt-8">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Headphones className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  TƯ VẤN CHUYÊN NGHIỆP
                </h3>
                <p className="text-muted-foreground">
                  Đội ngũ chuyên gia outdoor tư vấn và hỗ trợ khách hàng 24/7
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Style chuyentactical */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-secondary to-secondary/95 border-primary/20 border-2 max-w-4xl mx-auto">
            <CardContent className="pt-12 text-center">
              <div className="mb-8">
                <Mail className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-secondary-foreground mb-4">
                  ĐĂNG KÝ NHẬN TIN
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và
                  <span className="text-primary font-semibold">
                    {" "}
                    tips outdoor
                  </span>{" "}
                  hữu ích từ chuyên gia
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="flex gap-3 mb-6">
                  <Input
                    type="email"
                    placeholder="Nhập email của bạn..."
                    className="flex-1 bg-background text-foreground border-2 border-muted focus:border-primary"
                  />
                  <Button className="bg-primary hover:bg-primary/90 px-8 font-semibold">
                    ĐĂNG KÝ
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Không spam, chỉ thông tin hữu ích</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
