# 📡 API Contract Documentation — Sàn Hải Sản Cà Mau

> **Skill áp dụng:** `api-design-reviewer`, `api-patterns`
> **Trạng thái:** ✅ READONLY — Phải thống nhất API contract TRƯỚC khi code Frontend hoặc Backend.
> **Chuẩn:** RESTful API, JSON response, camelCase trong JSON

---

## 1. Quy Ước Chung (General Conventions)

### Base URL
```
Development:  http://localhost:3000/api/v1
Production:   https://haisancanmau.vn/api/v1
```

### Định dạng Response chuẩn
```typescript
// ✅ Success Response
{
  "success": true,
  "data": { ... },      // Object hoặc Array
  "meta": {             // Chỉ có khi phân trang
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}

// ✅ Error Response
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",  // Snake_case, uppercase
    "message": "Sản phẩm không tồn tại.",
    "details": {}                  // Optional, thêm info debug
  }
}
```

### HTTP Status Codes
| Code | Dùng khi |
|---|---|
| `200 OK` | GET thành công, PUT/PATCH thành công |
| `201 Created` | POST tạo mới thành công |
| `204 No Content` | DELETE thành công |
| `400 Bad Request` | Dữ liệu đầu vào không hợp lệ |
| `401 Unauthorized` | Chưa đăng nhập |
| `403 Forbidden` | Không có quyền |
| `404 Not Found` | Không tìm thấy resource |
| `409 Conflict` | Dữ liệu bị xung đột (VD: slug đã tồn tại) |
| `500 Internal Server Error` | Lỗi server |

---

## 2. Endpoints — Products (Sản phẩm)

### GET /products
Lấy danh sách sản phẩm (public, có phân trang)

**Query Parameters:**
| Param | Type | Required | Mô tả |
|---|---|---|---|
| `page` | number | No | Trang hiện tại (default: 1) |
| `limit` | number | No | Số item/trang (default: 20, max: 100) |
| `category` | string | No | Lọc theo category: `tom`, `ca`, `cua`, `muc` |
| `merchantId` | string | No | Lọc theo thương lái |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "tom-su-song-ca-mau",
      "name": "Tôm Sú Sống Cà Mau",
      "pricePerKg": 350000,
      "unit": "kg",
      "category": "tom",
      "isAvailable": true,
      "imageUrl": "https://...",
      "merchant": {
        "id": "uuid",
        "displayName": "Công Ty A",
        "slug": "cong-ty-a-ca-mau"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### GET /products/:slug
Lấy chi tiết sản phẩm theo slug (dùng cho SSG)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "tom-su-song-ca-mau",
    "name": "Tôm Sú Sống Cà Mau",
    "description": "...",
    "pricePerKg": 350000,
    "unit": "kg",
    "category": "tom",
    "isAvailable": true,
    "imageUrl": "https://...",
    "viewCount": 1234,
    "merchant": {
      "id": "uuid",
      "displayName": "Công Ty A",
      "slug": "cong-ty-a-ca-mau",
      "phone": "0912345678",
      "address": "123 Đường ABC, Cà Mau"
    },
    "createdAt": "2026-05-23T00:00:00Z",
    "updatedAt": "2026-05-23T00:00:00Z"
  }
}
```

**Error 404:**
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Sản phẩm không tồn tại."
  }
}
```

---

## 3. Endpoints — Merchants (Thương lái)

### GET /merchants
Lấy danh sách thương lái (public)

**Query Parameters:** `page`, `limit`, `province`

**Response 200:** (tương tự products, data là array merchants)

### GET /merchants/:slug
Lấy thông tin thương lái + danh sách sản phẩm của họ

---

## 4. Endpoints — Referrals (Hoa hồng)

### POST /referrals/log
Ghi lại một giao dịch hoa hồng (internal, cần auth)

**Request Body:**
```json
{
  "merchantId": "uuid",
  "productId": "uuid",          // Optional
  "commissionType": "per_percentage",
  "commissionValue": 5.0,       // 5%
  "orderValue": 1000000,
  "referrerNote": "nguon: facebook-post-001"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "commissionAmount": 50000,
    "status": "pending",
    "createdAt": "2026-05-23T10:00:00Z"
  }
}
```

---

## 5. Quy Tắc Naming API

| Loại | Quy tắc | Ví dụ |
|---|---|---|
| URL path | kebab-case, số nhiều | `/san-pham/`, `/thuong-lai/` |
| Query param | camelCase | `?merchantId=`, `?totalPages=` |
| JSON key | camelCase | `pricePerKg`, `isAvailable` |
| Error code | SCREAMING_SNAKE_CASE | `PRODUCT_NOT_FOUND` |

---

## 6. Versioning Strategy

- API version được đặt trong URL: `/api/v1/`
- Khi breaking change: tạo `/api/v2/` và giữ v1 còn hoạt động ít nhất 3 tháng
- Announce deprecation trong response header: `X-API-Deprecated: 2026-08-23`

---

*Tài liệu này được tạo bởi Antigravity (skill: api-design-reviewer, api-patterns) — Session 002 — 2026-05-23*
