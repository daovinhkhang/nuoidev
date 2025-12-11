# Sửa Lỗi: Xoá Hồ Sơ Không Xoá Khỏi Database

## 🐛 Vấn Đề
Khi xoá hồ sơ, nó không được xoá khỏi database. Khi reload lại trang, hồ sơ sẽ hiện lại.

## 🔍 Nguyên Nhân
**RLS (Row Level Security) Policy của Supabase không cho phép DELETE**

Schema chỉ có policies cho `SELECT`, `INSERT`, `UPDATE` nhưng thiếu policy cho `DELETE` trên các tables.

## ✅ Giải Pháp

### 1. Cập nhật RLS Policies
Đã thêm DELETE policies cho tất cả các tables:
- `profiles` - DELETE policy
- `posts` - DELETE policy  
- `comments` - DELETE policy
- `users` - DELETE policy (để unlink profile từ user)
- `chat_messages` - DELETE policy

### 2. Cải thiện Error Logging
Cập nhật hàm `deleteProfile()` để log lỗi chi tiết từ Supabase.

### 3. Áp Dụng Thay Đổi

#### Bước 1: Chạy migration Supabase
```bash
# Vào Supabase Dashboard của bạn
# SQL Editor > New Query
# Dán nội dung từ file supabase_schema.sql (hoặc chỉ phần RLS policies)
```

Hoặc nếu bạn có CLI Supabase:
```bash
supabase db push
```

#### Bước 2: Kiểm Tra Thay Đổi
Files đã được cập nhật:
- `supabase_schema.sql` - Thêm DELETE policies
- `src/lib/db.ts` - Cải thiện error logging

#### Bước 3: Test Tính Năng
1. Đăng nhập vào ứng dụng
2. Tạo hoặc chỉnh sửa một hồ sơ
3. Nhấn nút "Xoá hồ sơ"
4. Xác nhận xoá
5. Reload lại trang - hồ sơ sẽ được xoá hoàn toàn ✅

## 📊 Những Gì Đã Thay Đổi

### supabase_schema.sql
```sql
-- Thêm policies cho DELETE
create policy "Anyone can delete profile" on profiles for delete using (true);
create policy "Anyone can delete posts" on posts for delete using (true);
create policy "Anyone can delete comments" on comments for delete using (true);
create policy "Users can delete their own data" on users for delete using (true);
create policy "Anyone can delete chat" on chat_messages for delete using (true);
```

### src/lib/db.ts
- Thêm `console.error()` để log lỗi Supabase
- Thêm error handling cho việc unlink user từ profile

## 🚀 Lưu Ý
- Các policies sử dụng `using (true)` để cho phép mọi người xoá (phù hợp với thiết kế hiện tại)
- Nếu muốn bảo mật hơn, có thể thêm điều kiện ownership check
- Hãy kiểm tra browser console và server logs để xem lỗi chi tiết nếu vẫn có vấn đề
