

## Plan: Replace Razorpay with Cashfree Payment Gateway

### Overview
Replace all Razorpay payment integration with Cashfree across the project. Cashfree uses a two-step flow: (1) create an order server-side to get a `payment_session_id`, (2) use the Cashfree JS SDK on the frontend to open checkout.

### Step 1: Store Cashfree Secrets
- Add two secrets: `CASHFREE_APP_ID` (value: `1014099ca373a64c423fc103d159904101`) and `CASHFREE_SECRET_KEY` (value: `cfsk_ma_prod_8fc4d030f6ca23ecc8d21bad0c4f1af4_b140c65a`)

### Step 2: Create new Edge Function `create-cashfree-order`
- Replace `create-razorpay-order` with a new function that calls the Cashfree Create Order API (`https://api.cashfree.com/pg/orders`)
- Headers: `x-client-id`, `x-client-secret`, `x-api-version: 2023-08-01`, `Content-Type: application/json`
- Body: `order_amount`, `order_currency: INR`, `order_id` (unique), `customer_details` (email, phone, id)
- Returns `payment_session_id` to the frontend
- Register in `supabase/config.toml`

### Step 3: Update `index.html`
- Remove the Razorpay checkout script (`checkout.razorpay.com`)
- No script tag needed -- we'll use the `cashfree-js` npm package instead

### Step 4: Install `@cashfreepayments/cashfree-js` npm package
- This provides the `load()` function to initialize the Cashfree SDK

### Step 5: Update `Analyze.tsx`
- Replace `handleRewrite` to:
  1. Call `create-cashfree-order` edge function (instead of `create-razorpay-order`)
  2. Load Cashfree SDK via `load({ mode: "production" })`
  3. Call `cashfree.checkout({ paymentSessionId, returnUrl })` which redirects to Cashfree's hosted checkout
  4. On return, verify payment status and proceed with rewrite
- Alternative (simpler): Use a redirect-based flow where `returnUrl` points back to `/analyze?order_id=xxx`, and on mount we check payment status and auto-trigger the rewrite

### Step 6: Update `Pricing.tsx`
- Replace `handleProAccess` with same Cashfree flow: create order, open checkout, redirect to `/analyze` on success

### Step 7: Clean up
- Delete `create-razorpay-order` edge function (or repurpose the file)
- Remove Razorpay secrets if desired

### Technical Detail: Cashfree Checkout Flow
```text
Frontend                    Edge Function              Cashfree API
   │                            │                          │
   ├─ invoke create-cashfree ──►│                          │
   │   (amount, customer)       ├─ POST /pg/orders ───────►│
   │                            │◄── payment_session_id ───┤
   │◄── payment_session_id ─────┤                          │
   │                            │                          │
   ├─ cashfree.checkout() ─────────────────────────────────►│
   │   (hosted page opens)      │                          │
   │◄── redirect to returnUrl ─────────────────────────────┤
   │                            │                          │
   ├─ check order status ──────►│                          │
   │   (optional verification)  │                          │
```

### Files to modify
- `supabase/functions/create-cashfree-order/index.ts` -- new
- `supabase/config.toml` -- add new function config
- `index.html` -- remove Razorpay script
- `src/pages/Analyze.tsx` -- replace Razorpay with Cashfree
- `src/components/landing/Pricing.tsx` -- replace Razorpay with Cashfree
- `supabase/functions/create-razorpay-order/index.ts` -- delete

