import { Link } from "react-router-dom";
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Clock
} from "lucide-react";

function FooterMain() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">CF</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">CampFire</h3>
                <p className="text-sm opacity-80">Outdoor Equipment</p>
              </div>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Chuyên cung cấp thiết bị dã ngoại chất lượng cao cho những người yêu thích khám phá thiên nhiên.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:opacity-70 transition-opacity">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:opacity-70 transition-opacity">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:opacity-70 transition-opacity">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="opacity-80 hover:opacity-100 transition-opacity">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/products" className="opacity-80 hover:opacity-100 transition-opacity">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/blog" className="opacity-80 hover:opacity-100 transition-opacity">
                  Blog & Tin tức
                </Link>
              </li>
              <li>
                <Link to="/contact" className="opacity-80 hover:opacity-100 transition-opacity">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="opacity-80 hover:opacity-100 transition-opacity">
                  Chính sách bảo hành
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-semibold mb-4">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shipping" className="opacity-80 hover:opacity-100 transition-opacity">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link to="/returns" className="opacity-80 hover:opacity-100 transition-opacity">
                  Đổi trả sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/payment" className="opacity-80 hover:opacity-100 transition-opacity">
                  Hướng dẫn thanh toán
                </Link>
              </li>
              <li>
                <Link to="/faq" className="opacity-80 hover:opacity-100 transition-opacity">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/tracking" className="opacity-80 hover:opacity-100 transition-opacity">
                  Tra cứu đơn hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Thông tin liên hệ</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span className="opacity-80">
                  123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="opacity-80">1900-XXX-XXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="opacity-80">info@campfire.vn</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-1 flex-shrink-0" />
                <div className="opacity-80">
                  <p>T2-T6: 8:00 - 18:00</p>
                  <p>T7-CN: 8:00 - 17:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="opacity-80">
            © 2024 CampFire. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="opacity-80 hover:opacity-100 transition-opacity">
              Chính sách bảo mật
            </Link>
            <Link to="/terms" className="opacity-80 hover:opacity-100 transition-opacity">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterMain;