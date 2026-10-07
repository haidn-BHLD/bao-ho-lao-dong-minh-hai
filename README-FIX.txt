MINH HAI V4.3 - REPAIR PAGES + ADMIN + CATALOG DATA

Muc dich:
1. Giu/khôi phuc CNAME cho custom domain.
2. Dam bao GitHub Pages co .nojekyll va robots.txt.
3. Dam bao /admin/ co admin/index.html + admin/config.yml.
4. Khoi phuc data/products.json va data/categories.json da bi commit V4.3 xoa nham.
5. Khoi phuc anh san pham da bi xoa nham.

Cach dung:
- KHONG xoa repository hien tai.
- Copy TOAN BO NOI DUNG ben trong goi nay vao ROOT repository.
- Cho phep Replace cac file trung ten.
- GitHub Desktop: kiem tra thay data/products.json, data/categories.json, admin/index.html, CNAME, robots.txt duoc Add/Modified; KHONG co file quan trong bi Deleted.
- Commit message goi y: Repair Pages admin and restore catalog data
- Push origin binh thuong. KHONG Force Push.

Sau khi GitHub Pages deploy thanh cong, kiem tra:
https://baoholaodongminhhaitn.com/
https://baoholaodongminhhaitn.com/admin/
https://baoholaodongminhhaitn.com/data/products.json
https://baoholaodongminhhaitn.com/data/categories.json
https://baoholaodongminhhaitn.com/robots.txt

Neu /admin/ van 404 trong khi raw GitHub co admin/index.html, vao GitHub > Actions > pages build and deployment va dam bao run moi nhat cua commit repair co Status: Success.
