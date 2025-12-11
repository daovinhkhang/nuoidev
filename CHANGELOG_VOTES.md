# 🎉 Cập Nhật Hệ Thống Votes (Ủng Hộ)

## 📝 Thay Đổi

### **Từ:** Votes dựa trên thiết bị (Visitor ID)
- Cho phép bất kỳ ai vote (anonymous)
- Dùng IP/session để track votes
- Nhiều người cùng thiết bị = 1 lượt vote

### **Thành:** Votes dựa trên tài khoản (User ID)
- Chỉ người đã **đăng nhập** mới có thể vote
- Mỗi user = 1 lượt vote/profile/ngày
- Không thể vote cho chính mình

---

## 📊 Những File Đã Thay Đổi

### 1. **Database Schema** (`supabase_schema.sql`)
```sql
-- Trước:
CREATE TABLE votes (
  id text PRIMARY KEY,
  profile_id text,
  voter_id text,  -- IP/Session
  created_at timestamp
);

-- Sau:
CREATE TABLE votes (
  id text PRIMARY KEY,
  profile_id text REFERENCES profiles(id) ON DELETE CASCADE,
  user_id text REFERENCES users(id) ON DELETE CASCADE,  -- Đăng nhập
  created_at timestamp,
  UNIQUE(profile_id, user_id, DATE(created_at))  -- 1 vote/user/profile/day
);
```

### 2. **Backend**
- `src/lib/db.ts`
  - `mapVote()`: `voterId` → `userId`
  - `addVote()`: Lưu `user_id` thay vì `voter_id`
  - `hasVotedToday()`: Check `user_id` thay vì `voter_id`
  - `getTodayVoteCount()`: Check `user_id` thay vì `voter_id`

- `src/app/api/votes/route.ts`
  - ✅ Yêu cầu session cookie (đăng nhập)
  - ✅ Lấy `userId` từ session
  - ✅ Không cho vote chính mình
  - ✅ Check remaining votes từ session

### 3. **Frontend**
- `src/hooks/useVisitor.ts`
  - ✅ Xoá visitor ID logic
  - ✅ Dùng session cookie để check login
  - ✅ Fetch votes từ API mà không cần query param

- `src/components/ProfileCard/ProfileCard.tsx`
  - ✅ Check `isLoggedIn` trước khi vote
  - ✅ Show message "Vui lòng đăng nhập" nếu chưa login
  - ✅ Disable vote button khi chưa login

- `src/types/profile.ts`
  - `Vote` interface: `voterId` → `userId`

---

## 🔧 Hướng Dẫn Cập Nhật

### Bước 1: Backup dữ liệu votes cũ (nếu cần)
Nếu bạn có vote data quan trọng, backup trước:
```sql
CREATE TABLE votes_backup AS SELECT * FROM votes;
```

### Bước 2: Chạy migration
1. Vào **Supabase Dashboard** > **SQL Editor**
2. Chạy file `supabase_migrate_votes.sql`
3. Hoặc chạy commands từ `supabase_schema.sql` phần votes

### Bước 3: Update application
- Rebuild Next.js: `npm run dev` or `npm run build`
- Xoá browser cache/localStorage nếu cần

### Bước 4: Test
1. **Không đăng nhập**: Vote button bị disable
2. **Đăng nhập**: Vote button active
3. Vote 1 profile → Vote lại cùng profile → Show "Quay lại mai"
4. Vote 10 profiles → Vote profile 11 → Show hết lượt

---

## ⚠️ Lưu Ý

### Dữ liệu Cũ
- **Tất cả old votes sẽ bị xoá** khi migrate
- Nếu muốn giữ, cần convert data từ `voter_id` sang `user_id`
- Recommendation: Reset votes khi deploy

### Ranking
- Profile ranking vẫn dùng `profile.votes` (số lượng)
- Không ảnh hưởng đến logic ranking

### Rate Limiting
- Vẫn có 10 votes/user/ngày
- 1 vote/user/profile/ngày (do UNIQUE constraint)

### User Account
- Chỉ user đã tạo account mới vote được
- Anonymous users không thể vote

---

## 📱 User Experience

### Trước (Visitor-based):
```
🌐 Bất kỳ ai → Vote (10 lượt/ngày)
```

### Sau (User-based):
```
👤 Chưa đăng nhập → "Vui lòng đăng nhập"
✅ Đã đăng nhập → Vote (10 lượt/ngày)
🚫 Vote chính mình → "Không thể ủng hộ chính mình"
🔄 Voted hôm nay → "Quay lại mai"
```

---

## 🎯 Lợi Ích

✅ Chỉ user thật vote được (ngăn spam)
✅ Dễ track votes của user
✅ Không bị fake votes từ bot
✅ Có thể thêm rewards/gamification sau này
✅ Database constraints đảm bảo data integrity

---

Hoàn tất! Hệ thống votes giờ chỉ hoạt động cho **tài khoản đã đăng nhập** 🎉
