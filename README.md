# Website Bảo hộ lao động Minh Hải Thái Nguyên — V3

Bản V3 giữ nguyên bố cục giao diện catalogue hiện tại và bổ sung quản lý sản phẩm bằng Decap CMS.

## Chức năng khách hàng
- Giao diện nhận diện ngành bảo hộ lao động: navy kỹ thuật + cam an toàn + vàng cảnh báo.
- Danh mục sản phẩm động.
- Lọc theo nhóm sản phẩm.
- Lọc theo hãng.
- Click vào sản phẩm để xem ảnh lớn, hãng và mô tả.
- Gọi điện / gửi email / Google Maps.
- Responsive.

## Quản trị sản phẩm
Truy cập `/admin/` để mở Decap CMS.

Các trường:
- Tên sản phẩm
- Tên hãng
- Nhóm sản phẩm
- Ảnh sản phẩm
- Mô tả

Có thể:
- thêm sản phẩm
- sửa sản phẩm
- đổi ảnh
- xóa sản phẩm
- sắp xếp thứ tự

Dữ liệu được lưu tại `data/products.json`, ảnh tại `assets/products/`.
Không cần database.

## Kiến trúc
GitHub Pages
  -> website tĩnh
  -> data/products.json
  -> assets/products/

Decap CMS
  -> GitHub OAuth proxy
  -> GitHub repository
  -> commit cập nhật catalogue
  -> GitHub Pages tự deploy

## Lưu ý xác thực
GitHub backend của Decap cần server-side OAuth. Cấu hình mẫu trong `admin/config.yml` dùng OAuth proxy và không lưu secret trong repo.

Decap hiện có hosted Turbo backend, nhưng Turbo đang trong closed beta/waitlist, nên V3 không phụ thuộc Turbo để tránh chặn triển khai.

## Thông tin doanh nghiệp
- Email: haidn@baoholaodongminhhaitn.com
- Điện thoại: 0915418416
- Địa chỉ: Thửa đất số 163, tờ bản đồ số 68, số 486 đường Quang Trung, Tổ 1, phường Quyết Thắng, Tỉnh Thái Nguyên

## Chạy local
Vì trang chính dùng fetch cho `data/products.json`, nên chạy bằng HTTP server:

python -m http.server 8080

Sau đó mở:
http://localhost:8080

## Nguồn/thiết kế
- Decap CMS 3.16.x CDN.
- Không nhúng token GitHub vào client.
- Ảnh sản phẩm nên là ảnh tự chụp hoặc ảnh AI/có giấy phép sử dụng phù hợp.

## Cập nhật SEO V4.1
- Tên danh mục hiển thị tự nhiên, không lặp hậu tố “Thái Nguyên” trên từng thẻ sản phẩm/danh mục.
- Tín hiệu địa phương vẫn được giữ trong title, meta description, structured data, địa chỉ và nội dung mô tả tự nhiên.
- Không dùng kỹ thuật ẩn từ khóa bằng CSS.
- Thêm nút chuyển giao diện sáng/tối; lựa chọn được lưu trên trình duyệt.

