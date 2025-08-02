import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Clock,
  CreditCard,
  Truck,
  Shield,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                CampFire Outdoor
              </h3>
              <p className="text-sm">
                Chuyên cung cấp dụng cụ dã ngoại chất lượng cao từ các thương
                hiệu hàng đầu thế giới. Đồng hành cùng bạn trong mọi chuyến
                phiêu lưu.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-orange-400" />
                <span className="text-sm">123, Thủ Đức, TP.HCM</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-400" />
                <span className="text-sm">0909 090 909</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-400" />
                <span className="text-sm">info@campfireoutdoor.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-400" />
                <span className="text-sm">9:00 - 21:00 (Thứ 2 - CN)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Danh Mục</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/categories"
                  className="text-sm hover:text-orange-400 transition-colors"
                >
                  Balo & Túi Tactical
                </Link>
              </li>
              <li>
                <Link
                  to="/flashlights"
                  className="text-sm hover:text-orange-400 transition-colors"
                >
                  Đèn Pin Siêu Sáng
                </Link>
              </li>
              <li>
                <Link
                  to="/tactical-gear"
                  className="text-sm hover:text-orange-400 transition-colors"
                >
                  Trang Phục Tactical
                </Link>
              </li>
              <li>
                <Link
                  to="/tools"
                  className="text-sm hover:text-orange-400 transition-colors"
                >
                  Dụng Cụ Đa Năng
                </Link>
              </li>
              <li>
                <Link
                  to="/brands"
                  className="text-sm hover:text-orange-400 transition-colors"
                >
                  Thương Hiệu
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Hỗ Trợ</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/shipping"
                  className="text-sm hover:text-orange-400 transition-colors"
                >
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-sm hover:text-orange-400 transition-colors"
                >
                  Đổi trả & hoàn tiền
                </Link>
              </li>
              <li>
                <Link
                  to="/warranty"
                  className="text-sm hover:text-orange-400 transition-colors"
                >
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link
                  to="/size-guide"
                  className="text-sm hover:text-orange-400 transition-colors"
                >
                  Hướng dẫn chọn size
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm hover:text-orange-400 transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Kết Nối</h4>

            {/* Social Links */}
            <div className="flex gap-4 mb-6">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-sm mb-4">Đăng ký nhận tin khuyến mãi</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-orange-400"
                />
                <button className="px-4 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors">
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Truck className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm">
                  Miễn phí vận chuyển
                </h5>
                <p className="text-xs text-gray-400">Đơn hàng từ 2 triệu</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm">
                  Hàng chính hãng
                </h5>
                <p className="text-xs text-gray-400">Cam kết 100%</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm">
                  Thanh toán an toàn
                </h5>
                <p className="text-xs text-gray-400">Nhiều phương thức</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm">
                  Hỗ trợ 24/7
                </h5>
                <p className="text-xs text-gray-400">Tư vấn chuyên nghiệp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© 2024 CampFire Outdoor. Tất cả quyền được bảo lưu.</p>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="hover:text-orange-400 transition-colors"
              >
                Chính sách bảo mật
              </Link>
              <Link
                to="/terms"
                className="hover:text-orange-400 transition-colors"
              >
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
