import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";

function NoPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Trang không tìm thấy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>
          <div className="space-y-3">
            <Link to="/" className="block">
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Về trang chủ
              </Button>
            </Link>
            <Link to="/products" className="block">
              <Button variant="outline" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Xem sản phẩm
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NoPage;
