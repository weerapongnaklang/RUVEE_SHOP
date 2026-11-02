# ขั้นตอน Sign up และ Login (Supabase Auth)

เอกสารนี้เขียนไว้ศึกษาวิธีทำ auth ในโปรเจกต์นี้ endpoint และ payload เทียบกับซอร์สใน `node_modules/@supabase/auth-js` เวอร์ชัน 2.118.0 (`src/GoTrueClient.ts`) ส่วนค่าที่มาจากฝั่ง Supabase server เช่นอายุ token 1 ชั่วโมง เป็นค่าเริ่มต้นของ Supabase ซึ่งไม่ได้ตรวจจากซอร์สของ server

ไฟล์ที่เกี่ยวข้อง:

| ไฟล์ | หน้าที่ |
|---|---|
| `src/lib/supabase.js` | สร้าง Supabase client (อ่าน URL และ anon key จาก `.env.local`) |
| `src/app/signup/page.jsx` | หน้าสมัครสมาชิก |
| `src/app/login/page.jsx` | หน้าเข้าสู่ระบบ |
| `src/components/ProfileDrawer.jsx` | เช็กสถานะล็อกอิน, แสดงข้อมูลผู้ใช้, ปุ่ม logout |
| `supabase/auth.sql` | ตาราง `profiles`, trigger, RLS |

## 0. ภาพรวมผู้เล่น

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────────────┐
│  Browser     │     │ supabase-js     │     │ Supabase (ฝั่ง server)     │
│  (React page)│────►│ (auth-js ข้างใน) │────►│  Auth service (GoTrue)   │
│  login/signup│     │ src/lib/        │ HTTP│   ├─ auth.users          │
│  ProfileDrawer◄────│ supabase.js     │◄────│   ├─ ออก/ตรวจ JWT        │
└──────────────┘     └─────────────────┘     │  PostgREST + RLS         │
                       เก็บ session ใน        │   └─ public.profiles     │
                       localStorage          └──────────────────────────┘
```

โค้ดของเราเรียกแค่ `supabase.auth.*` ส่วนการยิง HTTP, การเก็บ token และการต่ออายุ ทำโดย `auth-js` เราไม่ต้องสร้างหรือแกะ JWT เอง

## 1. Sign up

ไฟล์: `src/app/signup/page.jsx`

```
ผู้ใช้กรอกฟอร์ม → กด SIGN UP หรือ Enter
        │
        ▼
handleSubmit(e)
  1. e.preventDefault()              ← กัน browser ส่ง GET แล้วรหัสผ่านโผล่ใน URL
  2. อ่านค่าด้วย FormData(e.currentTarget)
  3. password !== confirmPassword ?  → แสดง error แล้วหยุด (ไม่ยิง Supabase)
  4. setLoading(true)
        │
        ▼
supabase.auth.signUp({ email, password, options: { data: { display_name } } })
        │  HTTP
        ▼
POST {SUPABASE_URL}/auth/v1/signup
```

Payload ที่ `auth-js` ส่งจริง (`GoTrueClient.ts` บรรทัด 1046-1060):

```json
{
  "email": "you@example.com",
  "password": "********",
  "data": { "display_name": "Somchai" },
  "gotrue_meta_security": { "captcha_token": undefined },
  "code_challenge": null,
  "code_challenge_method": null
}
```

- `data` คือ user metadata ที่ใส่ใน `options.data`
- `gotrue_meta_security` ใช้กับ captcha ซึ่งยังไม่ได้เปิด
- `code_challenge` ใช้เฉพาะ flow แบบ PKCE ซึ่งไม่ใช่ค่าเริ่มต้นของ client นี้ จึงเป็น null

สิ่งที่ Supabase ทำต่อ:

```
Auth service
  ├─ ตรวจรูปแบบอีเมลและความยาวรหัสผ่าน
  ├─ hash รหัสผ่าน แล้ว INSERT แถวใหม่ลง auth.users
  │       (raw_user_meta_data = {"display_name": "Somchai"})
  │
  ├─ Trigger on_auth_user_created ทำงาน (ใน supabase/auth.sql)
  │     handle_new_user()
  │       INSERT INTO public.profiles (id, email, display_name)
  │       VALUES (new.id, new.email, new.raw_user_meta_data->>'display_name')
  │
  └─ ตอบกลับ ขึ้นกับการตั้งค่า "Confirm email"
```

ผลลัพธ์สองแบบ:

| ตั้งค่า | Response | โค้ดเรา |
|---|---|---|
| ปิด Confirm email (ตอนนี้) | `{ user, session }` มี session | `data.session` มีค่า → `router.push("/home")` |
| เปิด Confirm email | `{ user, session: null }` | `!data.session` → แสดง "Check your email..." |

รูปร่างของ session เมื่อสำเร็จ:

```json
{
  "access_token": "eyJhbGciOi...",   // JWT อายุสั้น
  "token_type": "bearer",
  "expires_in": 3600,
  "expires_at": 1767225600,          // epoch วินาที
  "refresh_token": "abc123...",      // ใช้ขอ access token ใหม่
  "user": { "id": "uuid", "email": "...", "user_metadata": { "display_name": "..." } }
}
```

จากนั้น `auth-js` เก็บ session ลง localStorage ที่ key รูปแบบ `sb-<project-ref>-auth-token` (จาก `SupabaseClient.ts`: `sb-${hostname.split('.')[0]}-auth-token`) และแจ้ง event `SIGNED_IN` ให้ `onAuthStateChange`

## 2. Login

ไฟล์: `src/app/login/page.jsx`

```
handleSubmit(e)
  1. e.preventDefault()
  2. setError(""), setLoading(true)
  3. FormData → email, password
        │
        ▼
supabase.auth.signInWithPassword({ email, password })
        │
        ▼
POST {SUPABASE_URL}/auth/v1/token?grant_type=password
```

Payload (`GoTrueClient.ts` บรรทัด 1243-1251):

```json
{
  "email": "you@example.com",
  "password": "********",
  "gotrue_meta_security": { "captcha_token": undefined }
}
```

Supabase ทำต่อ:

```
Auth service
  ├─ หาแถวใน auth.users ตามอีเมล
  ├─ เทียบรหัสผ่านกับ hash ที่เก็บไว้
  ├─ ถูก → ออก access_token (JWT) + refresh_token → ตอบ session (รูปร่างเหมือนข้างบน)
  └─ ผิด → ตอบ error "Invalid login credentials"
```

กลับมาที่โค้ดเรา:

```
const { error: authError } = await ...
  ├─ authError มี → setError(authError.message), setLoading(false), หยุด
  └─ ไม่มี → router.push("/home"); router.refresh()
```

ข้อความ "Invalid login credentials" ไม่บอกว่าอีเมลผิดหรือรหัสผ่านผิด ตั้งใจให้เป็นแบบนี้เพื่อไม่ให้คนเดาได้ว่าอีเมลไหนมีบัญชีอยู่

การกด Enter ใน input ทำให้ submit ได้เอง เพราะ input อยู่ใน `<form>` ที่มีปุ่ม `type="submit"` ไม่ต้องเขียน `onKeyDown`

## 3. หลัง login: ระบบรู้ได้อย่างไรว่าเป็นใคร

ไฟล์: `src/components/ProfileDrawer.jsx`

```
โหลดหน้า / เปิดแท็บใหม่
  │
  ├─ supabase.auth.getSession()
  │     └─ auth-js อ่าน session จาก localStorage
  │        (ถ้า access token ใกล้หมดอายุ จะ refresh ให้ก่อนคืนค่า)
  │     → { data: { session } }  → setUser(session?.user ?? null)
  │
  ├─ supabase.auth.onAuthStateChange(callback)
  │     คืน event เมื่อสถานะเปลี่ยน: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED ...
  │     → setUser(session?.user ?? null)
  │
  └─ มี userId แล้ว → supabase.from("profiles").select(...).eq("id", userId)
```

การเรียก `profiles` มี token แนบอัตโนมัติ:

```
GET {SUPABASE_URL}/rest/v1/profiles?select=display_name,email,phone,created_at&id=eq.<uuid>
Headers:
  apikey:        <anon key>
  Authorization: Bearer <access_token>   ← auth-js ใส่ให้เอง
        │
        ▼
PostgREST ตรวจ JWT → รู้ว่า auth.uid() = <uuid>
        │
        ▼
RLS policy "Users can read own profile":  (select auth.uid()) = id
        → คืนเฉพาะแถวของผู้ใช้คนนี้
```

เพราะเหตุนี้ผู้ใช้อ่านโปรไฟล์คนอื่นไม่ได้ แม้จะยิง API เองก็ตาม

## 4. Token หมดอายุ

```
access_token อายุประมาณ 1 ชั่วโมง (expires_in = 3600 เป็นค่าเริ่มต้นของ Supabase)
        │
        ▼
auth-js ตั้ง timer ตรวจทุก 30 วินาที (AUTO_REFRESH_TICK_DURATION_MS)
เมื่อเหลือเวลา < 90 วินาที (EXPIRY_MARGIN_MS = 3 × 30 วินาที)
        │
        ▼
POST /auth/v1/token?grant_type=refresh_token
Body: { "refresh_token": "abc123..." }
        │
        ▼
ได้ session ใหม่ (access + refresh ตัวใหม่) → เก็บทับใน localStorage
→ ยิง event TOKEN_REFRESHED
```

ตัวเลข 30 วินาทีและ 90 วินาทีมาจาก `auth-js/src/lib/constants.ts` เป็นรายละเอียดภายในของแพ็กเกจ อาจเปลี่ยนตามเวอร์ชัน

## 5. Logout

```
กดปุ่ม LOG OUT → handleLogout()
  1. await supabase.auth.signOut()
        │   ค่าเริ่มต้น scope = 'global' (GoTrueClient.ts บรรทัด 4069)
        ▼
   POST /auth/v1/logout?scope=global
   Header: Authorization: Bearer <access_token>
        → Supabase เพิกถอน refresh token ของผู้ใช้ (ทุกอุปกรณ์ เพราะเป็น global)
   auth-js ลบ session ออกจาก localStorage + ยิง event SIGNED_OUT
  2. setOpen(false)
  3. router.refresh()
```

`onAuthStateChange` รับ `SIGNED_OUT` → `setUser(null)` → drawer สลับกลับเป็นหน้า "ยังไม่ล็อกอิน" เอง

## 6. ลำดับเหตุการณ์ทั้งหมดในภาพเดียว

```
 ผู้ใช้        หน้า signup/login      supabase-js       Supabase Auth     Postgres
  │  กรอกฟอร์ม      │                      │                  │               │
  ├───────────────►│                      │                  │               │
  │                ├─signUp/signIn(...)──►│                  │               │
  │                │                      ├─POST /signup ───►│               │
  │                │                      │  หรือ /token     ├─INSERT users─►│
  │                │                      │                  │  trigger →    │
  │                │                      │                  │  INSERT profiles
  │                │                      │◄─ session(JWT) ──┤               │
  │                │                      ├─ เก็บใน localStorage             │
  │                │                      ├─ ยิง SIGNED_IN                   │
  │                │◄── { data, error } ──┤                  │               │
  │◄── router.push("/home") ──┤           │                  │               │
  │                                       │                                  │
  │  เปิด drawer   ProfileDrawer ─ getSession() → user                      │
  │                ├─ from("profiles").select ─ Bearer JWT ─► PostgREST+RLS ─►│
  │◄── แสดงชื่อ/อีเมล ◄────────────────────────────────────── แถวของตัวเอง ◄─┤
```

## 7. ฟังก์ชันที่ใช้ทั้งหมด

| ฟังก์ชัน | ใช้ที่ไหน | ทำอะไร | Endpoint |
|---|---|---|---|
| `auth.signUp({email,password,options})` | signup | สร้างบัญชี | `POST /auth/v1/signup` |
| `auth.signInWithPassword({email,password})` | login | ล็อกอิน | `POST /auth/v1/token?grant_type=password` |
| `auth.getSession()` | ProfileDrawer | อ่าน session จาก localStorage | ไม่ยิงเครือข่าย (ยกเว้นต้อง refresh) |
| `auth.onAuthStateChange(cb)` | ProfileDrawer | ฟังเหตุการณ์ login/logout/refresh | ไม่มี |
| `auth.signOut()` | ProfileDrawer | ออกจากระบบ | `POST /auth/v1/logout?scope=global` |
| `from("profiles").select()` | ProfileDrawer | อ่านโปรไฟล์ตัวเอง | `GET /rest/v1/profiles` |

ที่ยังไม่ได้ใช้ในโปรเจกต์ แต่ควรรู้สำหรับขั้นต่อไป:

- `auth.getUser()` ถามเซิร์ฟเวอร์เพื่อยืนยันตัวตน ใช้ฝั่ง server
- `auth.resetPasswordForEmail()` ลืมรหัสผ่าน
- `auth.updateUser()` เปลี่ยนรหัสผ่านหรืออีเมล

## 8. ข้อจำกัดของแบบที่ใช้อยู่ตอนนี้

- session เก็บใน localStorage ฝั่ง server (เช่น `src/app/home/page.jsx`) ไม่รู้ว่าใครล็อกอิน ถ้าต้องป้องกันหน้าจากฝั่ง server ต้องใช้ `@supabase/ssr` ซึ่งเก็บ session ใน cookie
- การซ่อนหรือแสดง UI ตามสถานะล็อกอินฝั่ง client เป็นแค่เรื่องหน้าตา ผู้ใช้แก้ค่าในเบราว์เซอร์ได้ ความปลอดภัยของข้อมูลจริงอยู่ที่ RLS ใน `supabase/auth.sql`
- ยังไม่มีหน้า "ลืมรหัสผ่าน"
- ตอนนี้ปิด Confirm email ไว้ ใครก็สมัครด้วยอีเมลของคนอื่นได้ ควรเปิดก่อนขึ้นระบบจริง

## 9. วิธีดูของจริงด้วยตัวเอง

1. DevTools > **Network** > กรอง `supabase` แล้วลองล็อกอิน จะเห็นคำขอ `token?grant_type=password` กด Payload เพื่อดู body และ Response เพื่อดู session
2. DevTools > **Application** > **Local Storage** หา key `sb-...-auth-token` จะเห็น session ที่เก็บไว้
3. Supabase Dashboard > **Authentication > Users** จะเห็นผู้ใช้ที่เพิ่งสมัคร และ **Table Editor > profiles** จะเห็นแถวที่ trigger สร้างให้
4. ล็อกเอาต์แล้วเรียก `profiles` จะเห็น RLS คืนข้อมูลว่าง

ข้อควรระวัง: ใน DevTools จะเห็น password และ token จริง ใช้บัญชีทดสอบเท่านั้น และอย่าแคปหน้าจอหรือคัดลอกส่วนนั้นไปวางในที่สาธารณะ
