import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const appId = Deno.env.get("CASHFREE_APP_ID");
    const secretKey = Deno.env.get("CASHFREE_SECRET_KEY");

    if (!appId || !secretKey) {
      throw new Error("Cashfree credentials not configured");
    }

    const { amount = 99, currency = "INR", customer_email, customer_phone, customer_id, return_url } = await req.json();

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const response = await fetch("https://api.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: currency,
        customer_details: {
          customer_id: customer_id || `cust_${Date.now()}`,
          customer_email: customer_email || "customer@example.com",
          customer_phone: customer_phone || "9999999999",
        },
        order_meta: {
          return_url: return_url || undefined,
        },
      }),
    });

    const order = await response.json();

    if (!response.ok) {
      console.error("Cashfree order error:", order);
      throw new Error(order.message || "Failed to create Cashfree order");
    }

    return new Response(
      JSON.stringify({
        payment_session_id: order.payment_session_id,
        order_id: order.order_id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
