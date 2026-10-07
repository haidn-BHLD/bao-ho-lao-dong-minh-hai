# HƯỚNG DẪN TRIỂN KHAI SEO — MINH HẢI

Bản này đã sửa `index.html` bị vô tình chỉ còn phần `<head>` và khôi phục đầy đủ giao diện.

## Các thay đổi đã thực hiện

- Tối ưu title, meta description, canonical và Open Graph cho trang chủ.
- Thêm `Store` + `WebSite` JSON-LD trên trang chủ.
- Đổi H1 và nội dung trang chủ theo chủ đề “bảo hộ lao động Thái Nguyên / Minh Hải”.
- Xóa các câu ghi chú kỹ thuật về “website”, “ảnh AI” khỏi nội dung khách hàng.
- Sửa liên kết email `mailto:` bị sai.
- Thêm liên kết HTML crawlable đến 7 trang danh mục.
- Tạo 7 landing page SEO: giày, quần áo, mũ, găng tay, kính, chống rơi, bảo vệ hô hấp.
- Cập nhật `sitemap.xml` với 8 URL canonical.
- Giữ nguyên Decap CMS/Turbo và cơ chế `products.json` hiện tại.

## Cách cập nhật GitHub

1. Sao lưu branch hiện tại trước khi thay file.
2. Copy toàn bộ nội dung của thư mục bản SEO vào repository local hiện tại, **không copy `.git`**.
3. Kiểm tra GitHub Desktop → Changes.
4. Commit: `SEO: optimize homepage and add category landing pages`
5. Push origin.
6. Chờ GitHub Pages deploy.

## Kiểm tra sau deploy

Mở các URL:

- https://baoholaodongminhhaitn.com/
- https://baoholaodongminhhaitn.com/giay-bao-ho/
- https://baoholaodongminhhaitn.com/quan-ao-bao-ho/
- https://baoholaodongminhhaitn.com/sitemap.xml
- https://baoholaodongminhhaitn.com/robots.txt

Sau đó dùng Google Search Console → Kiểm tra URL cho trang chủ và 2 trang ưu tiên (`giay-bao-ho/`, `quan-ao-bao-ho/`) rồi Yêu cầu lập chỉ mục.

## Lưu ý

SEO kỹ thuật và nội dung giúp Google hiểu website tốt hơn nhưng không thể bảo đảm vị trí số 1. Local Search còn phụ thuộc mức độ liên quan, khoảng cách và mức độ nổi bật; cần tiếp tục hoàn thiện Google Business Profile, ảnh thực tế, review thật và các nguồn uy tín liên kết/nhắc đến doanh nghiệp.
