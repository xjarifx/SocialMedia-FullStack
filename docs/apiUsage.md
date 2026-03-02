# Social Network API Usage Guide (with Examples)

This guide explains how to use the API in practice, with copy-paste examples.

## Base URL

- Local server: `http://localhost:5000`
- API prefix: `/api/v1`
- Full base URL used below: `http://localhost:5000/api/v1`

## OpenAPI / Swagger

If the server is running, interactive docs are available at:

- `http://localhost:5000/api-docs`

## Authentication

Most endpoints require a Bearer access token in the header:

```http
Authorization: Bearer <accessToken>
```

### 1) Register

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "Strong#Pass1",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Example response:

```json
{
  "success": true,
  "data": {
    "accessToken": "<jwt-access-token>",
    "refreshToken": "<jwt-refresh-token>"
  },
  "error": null
}
```

### 2) Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Strong#Pass1"
  }'
```

### 3) Refresh token

```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<jwt-refresh-token>"
  }'
```

### 4) Logout

```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<jwt-refresh-token>"
  }'
```

## Common patterns

## Headers

Authenticated call:

```bash
-H "Authorization: Bearer <accessToken>"
```

JSON body:

```bash
-H "Content-Type: application/json"
```

## Pagination

Different modules use one of these query styles:

- `?page=1&limit=10`
- `?offset=0&limit=10`

Always check each endpoint's expected query style in Swagger.

## Response shapes

- Auth endpoints return envelope style: `{ success, data, error }`
- Many other endpoints return direct object/array payloads
- Errors are usually returned as `{ error: "message" }` or auth-style `{ success: false, data: {}, error: "..." }`

## Users

### Get my profile

```bash
curl http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer <accessToken>"
```

### Update my profile

```bash
curl -X PATCH http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Johnny",
    "lastName": "Doe"
  }'
```

### Search users

```bash
curl "http://localhost:5000/api/v1/users/search?q=john&limit=10&offset=0"
```

### Get a user by ID

```bash
curl http://localhost:5000/api/v1/users/<userId>
```

### Get a user's posts

```bash
curl "http://localhost:5000/api/v1/users/<userId>/posts?page=1&limit=10" \
  -H "Authorization: Bearer <accessToken>"
```

## Follows

### Follow a user

```bash
curl -X POST http://localhost:5000/api/v1/users/<userId>/follow \
  -H "Authorization: Bearer <accessToken>"
```

### Unfollow a user

`followingId` is the follow relationship ID.

```bash
curl -X DELETE http://localhost:5000/api/v1/users/<userId>/follow/<followingId> \
  -H "Authorization: Bearer <accessToken>"
```

### Followers / Following lists

```bash
curl http://localhost:5000/api/v1/users/<userId>/followers \
  -H "Authorization: Bearer <accessToken>"

curl http://localhost:5000/api/v1/users/<userId>/following \
  -H "Authorization: Bearer <accessToken>"
```

## Posts

### Create text post

```bash
curl -X POST http://localhost:5000/api/v1/posts \
  -H "Authorization: Bearer <accessToken>" \
  -F "content=Hello world from API" \
  -F "visibility=PUBLIC"
```

### Create post with media upload

Allowed file types: image/_ or video/_ (max 50MB).

```bash
curl -X POST http://localhost:5000/api/v1/posts \
  -H "Authorization: Bearer <accessToken>" \
  -F "content=Check my upload" \
  -F "image=@/absolute/path/to/file.jpg"
```

### Feed endpoints

```bash
curl "http://localhost:5000/api/v1/posts/feed?page=1&limit=10" \
  -H "Authorization: Bearer <accessToken>"

curl "http://localhost:5000/api/v1/posts/for-you?page=1&limit=10" \
  -H "Authorization: Bearer <accessToken>"
```

### Get, update, delete post

```bash
curl http://localhost:5000/api/v1/posts/<postId>

curl -X PATCH http://localhost:5000/api/v1/posts/<postId> \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"content":"Updated content","visibility":"PUBLIC"}'

curl -X DELETE http://localhost:5000/api/v1/posts/<postId> \
  -H "Authorization: Bearer <accessToken>"
```

## Likes

### Like / unlike post

```bash
curl -X POST http://localhost:5000/api/v1/posts/<postId>/likes \
  -H "Authorization: Bearer <accessToken>"

curl -X DELETE http://localhost:5000/api/v1/posts/<postId>/likes \
  -H "Authorization: Bearer <accessToken>"
```

### Get users who liked a post

```bash
curl "http://localhost:5000/api/v1/posts/<postId>/likes?page=1&limit=10" \
  -H "Authorization: Bearer <accessToken>"
```

## Comments

### Create comment

```bash
curl -X POST http://localhost:5000/api/v1/posts/<postId>/comments \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Nice post!",
    "postId": "<postId>"
  }'
```

### Reply to a comment (threaded)

```bash
curl -X POST http://localhost:5000/api/v1/posts/<postId>/comments \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I agree",
    "postId": "<postId>",
    "parentId": "<commentId>"
  }'
```

### Get comments

```bash
curl "http://localhost:5000/api/v1/posts/<postId>/comments?offset=0&limit=10" \
  -H "Authorization: Bearer <accessToken>"
```

### Update / delete comment

```bash
curl -X PATCH http://localhost:5000/api/v1/posts/<postId>/comments/<commentId> \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"content":"Edited comment"}'

curl -X DELETE http://localhost:5000/api/v1/posts/<postId>/comments/<commentId> \
  -H "Authorization: Bearer <accessToken>"
```

### Like / unlike comment

```bash
curl -X POST http://localhost:5000/api/v1/posts/<postId>/comments/<commentId>/likes \
  -H "Authorization: Bearer <accessToken>"

curl -X DELETE http://localhost:5000/api/v1/posts/<postId>/comments/<commentId>/likes \
  -H "Authorization: Bearer <accessToken>"
```

## Notifications

### List notifications

```bash
curl "http://localhost:5000/api/v1/notifications?page=1&limit=10" \
  -H "Authorization: Bearer <accessToken>"
```

### Get one notification

```bash
curl http://localhost:5000/api/v1/notifications/<notificationId> \
  -H "Authorization: Bearer <accessToken>"
```

### Mark notification as read

```bash
curl -X PATCH http://localhost:5000/api/v1/notifications/<notificationId> \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"read": true}'
```

### Delete notification

```bash
curl -X DELETE http://localhost:5000/api/v1/notifications/<notificationId> \
  -H "Authorization: Bearer <accessToken>"
```

## Blocks

### Block a user by username

```bash
curl -X POST http://localhost:5000/api/v1/blocks \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"username":"ann_smith"}'
```

### List blocked users

```bash
curl "http://localhost:5000/api/v1/blocks?offset=0&limit=10" \
  -H "Authorization: Bearer <accessToken>"
```

### Unblock a user by username

```bash
curl -X DELETE http://localhost:5000/api/v1/blocks \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"username":"ann_smith"}'
```

## Billing

### Debug recent checkout sessions (optional)

```bash
curl http://localhost:5000/api/v1/billing/debug/recent-sessions \
  -H "Authorization: Bearer <accessToken>"
```

### Get my billing status

```bash
curl http://localhost:5000/api/v1/billing/me \
  -H "Authorization: Bearer <accessToken>"
```

### Create checkout session

```bash
curl -X POST http://localhost:5000/api/v1/billing/create-checkout-session \
  -H "Authorization: Bearer <accessToken>"
```

Example response:

```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "sessionId": "cs_test_..."
}
```

### Confirm payment after Stripe redirect

Use either `session_id` or `payment_intent_id`.

```bash
curl "http://localhost:5000/api/v1/billing/confirm?session_id=cs_test_..." \
  -H "Authorization: Bearer <accessToken>"
```

### Downgrade to free plan

```bash
curl -X POST http://localhost:5000/api/v1/billing/downgrade \
  -H "Authorization: Bearer <accessToken>"
```

### Stripe webhook (server-to-server)

This endpoint is called by Stripe, not by the frontend client:

- `POST /api/v1/billing/webhook`

## Using the API from JavaScript (fetch)

```js
const API_BASE = "http://localhost:5000/api/v1";

async function getMyProfile(accessToken) {
  const response = await fetch(`${API_BASE}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || "Failed to fetch profile");
  }

  return response.json();
}
```

## Troubleshooting

- `401 Unauthorized`: token missing/expired/invalid.
- `403 Forbidden`: authenticated but not allowed (ownership or block restrictions).
- `404 Not Found`: invalid resource ID or resource does not exist.
- `429 Too Many Requests`: rate limit reached; retry after a delay.
- `400 Bad Request`: payload/query/path validation failed.
