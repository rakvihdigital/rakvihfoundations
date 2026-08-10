// src/lib/razorpay.ts
// SERVER-ONLY. Requires: npm install razorpay
//
// Add to .env.local (get these from Razorpay Dashboard > Settings > API Keys):
// RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
// RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
// NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx   <-- same key id, exposed to browser for checkout

import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});