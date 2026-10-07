# Cấu hình khu vực quản trị sản phẩm

Website đã tích hợp Decap CMS tại:

    /admin/

CMS này quản lý `data/products.json`; mỗi sản phẩm có thể:
- Thêm mới
- Sửa tên sản phẩm
- Sửa tên hãng
- Đổi nhóm
- Upload/thay ảnh
- Sửa mô tả
- Xóa
- Kéo để sắp xếp thứ tự

Decap CMS lưu thay đổi bằng Git commit vào repository GitHub, không cần database riêng.

## Quan trọng: đăng nhập GitHub

GitHub backend của Decap cần một OAuth proxy. Bản hiện tại dùng cấu hình `backend: github` với `base_url` trỏ tới một Cloudflare Worker OAuth proxy.

Không đặt GitHub OAuth client secret trong repository.

### Cách nhanh nhất

1. Tạo một Cloudflare account (Workers Free phù hợp với proxy nhỏ).
2. Dùng template chính thức được Decap liên kết:
   https://github.com/sterlingwes/decap-proxy
3. Tạo GitHub OAuth App:
   - Homepage URL: URL của Worker, ví dụ `https://minh-hai-decap-proxy.<account>.workers.dev`
   - Callback URL: URL Worker + `/callback`
4. Lưu Client ID/Client Secret của GitHub OAuth App vào Cloudflare Worker Secrets:
   - `GITHUB_OAUTH_ID`
   - `GITHUB_OAUTH_SECRET`
5. Deploy Worker.
6. Trong `admin/config.yml`, thay:
   `https://REPLACE_WITH_YOUR_OAUTH_PROXY`
   bằng URL Worker thực tế.
7. Commit các file này lên branch `main`.
8. Mở:
   `https://<site>/admin/`
   và đăng nhập bằng tài khoản GitHub có quyền ghi repository.

## Lưu ý về quyền

CMS này được thiết kế cho chính chủ website. Người đăng nhập cần quyền ghi vào repository, theo yêu cầu của GitHub backend của Decap.

## Ảnh

Decap sẽ upload ảnh vào:

    assets/products/

Khi xóa một sản phẩm khỏi danh sách, sản phẩm biến mất khỏi catalogue; file ảnh cũ có thể còn lại trong repository dưới dạng file mồ côi. Có thể dọn ảnh định kỳ.

## Decap Turbo

Không bắt buộc dùng Turbo. Decap CMS vẫn là mã nguồn mở miễn phí. Decap Turbo hiện đang ở closed beta/waitlist; cấu hình hiện tại tránh phụ thuộc vào Turbo.
