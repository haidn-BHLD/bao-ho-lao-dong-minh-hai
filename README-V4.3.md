# Minh Hải Website V4.3 — Gói cập nhật trên nền V4.2

## Thay đổi chính

- Header chỉ giữ logo, nút sáng/tối, nút gọi và **MENU** ở góc phải.
- MENU dạng dropdown gồm:
  - Giới thiệu
  - Sản phẩm → danh mục động từ `data/categories.json`
  - Thương hiệu
  - Liên hệ
- Trang chủ **không hiển thị danh sách sản phẩm**.
- Trang chủ theo thứ tự:
  1. Giới thiệu ngắn
  2. Giới thiệu doanh nghiệp chi tiết
  3. Hình ảnh doanh nghiệp (tự hiện khi có ảnh)
  4. Liên hệ
- Điện thoại và email có nút **Sao chép**.
- Nội dung trang chủ, giới thiệu, hình ảnh công ty và liên hệ chỉnh được trong `/admin/` → **Nội dung website**.
- Toàn bộ sản phẩm được chuyển sang `/san-pham/`, có lọc danh mục, thương hiệu và phân trang 8 sản phẩm/trang.
- Click sản phẩm mở trang chi tiết riêng theo URL `san-pham/chi-tiet.html?sp=<slug>`, không mở popup.
- Trang chi tiết hỗ trợ:
  - ảnh đại diện
  - ảnh bổ sung
  - mô tả ngắn
  - nội dung chi tiết
  - thông số/đặc điểm
  - sản phẩm liên quan
  - khối liên hệ hỏi mẫu/báo giá
- Các trang sản phẩm/danh mục/thương hiệu có cụm liên hệ nổi Gọi / Email / Địa chỉ.
- `/thuong-hieu/` liệt kê thương hiệu và dẫn sang sản phẩm tương ứng.
- Danh mục vẫn thêm/xóa/sắp xếp trong admin; danh mục mới có thể dùng trang động `/danh-muc/?category=...`.

## Rất quan trọng khi cập nhật

Đây là **gói update**, không phải bản thay thế dữ liệu.

Không xóa hoặc ghi đè dữ liệu hiện tại của bạn:

- `data/products.json`
- `data/categories.json`
- `assets/products/`

Gói V4.3 cố tình **không chứa** `products.json` và `categories.json` để giữ nguyên sản phẩm/danh mục đang có.

## Cách triển khai

1. Tạo branch backup, ví dụ `backup-before-v4.3`.
2. Quay lại `main`.
3. Giải nén gói V4.3.
4. Copy toàn bộ file/folder bên trong vào repository hiện tại.
5. Chọn **Replace** cho file trùng.
6. Trong GitHub Desktop kiểm tra `data/products.json`, `data/categories.json`, `assets/products/` không bị Deleted.
7. Commit: `V4.3: compact menu home content and product detail pages`.
8. Push origin.

## Kiểm tra sau deploy

- `/` → không còn product grid.
- `/san-pham/` → có danh mục + sản phẩm + phân trang.
- `/thuong-hieu/` → có thương hiệu.
- Click 1 sản phẩm → mở `san-pham/chi-tiet.html?sp=...`.
- Trang chi tiết → nút “Liên hệ hỏi mẫu / báo giá” cuộn đúng tới khối liên hệ của sản phẩm.
- Các trang con → bên phải có Gọi / Email / Địa chỉ.
- `/admin/` → có **Nội dung website** và **Danh mục & Sản phẩm**.

## Hình ảnh công ty

`data/site.json` mặc định chưa có ảnh công ty vì chưa có ảnh thực tế được cung cấp. Khu vực ảnh trên trang chủ sẽ tự ẩn để không hiển thị ảnh giả.

Sau khi vào `/admin/` → **Nội dung website** → **Trang chủ & Liên hệ** → **Hình ảnh công ty** và tải ảnh lên, khu vực ảnh sẽ tự xuất hiện trên trang chủ.
