import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  }
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("SB_URL") ?? "";
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SB_SERVICE_ROLE_KEY") ?? "";
  const PAGOTIC_API_URL = Deno.env.get("PAGOTIC_API_URL") ?? "https://api.pagotic.com";
  const PAGOTIC_API_KEY = Deno.env.get("PAGOTIC_API_KEY") ?? "";
  const PAGOTIC_CLIENT_ID = Deno.env.get("PAGOTIC_CLIENT_ID") ?? "";
  const PAGOTIC_CLIENT_SECRET = Deno.env.get("PAGOTIC_CLIENT_SECRET") ?? "";
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const payload = await req.json();
  const requestBody = {
    publication_id: String(payload.publication_id ?? ""),
    user_id: String(payload.user_id ?? ""),
    amount: Number(payload.amount ?? 0),
    currency: String(payload.currency ?? "ARS"),
    description: String(payload.description ?? ""),
    return_url: String(payload.return_url ?? ""),
    cancel_url: String(payload.cancel_url ?? "")
  };
  let paymentUrl = "";
  let reference = crypto.randomUUID();
  try {
    let authHeader = "";
    if (PAGOTIC_API_KEY) {
      authHeader = `Bearer ${PAGOTIC_API_KEY}`;
    } else if (PAGOTIC_CLIENT_ID && PAGOTIC_CLIENT_SECRET) {
      try {
        const tokenRes = await fetch(`${PAGOTIC_API_URL}/oauth/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grant_type: "client_credentials",
            client_id: PAGOTIC_CLIENT_ID,
            client_secret: PAGOTIC_CLIENT_SECRET,
          }),
        });
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          if (tokenData.access_token) {
            authHeader = `Bearer ${tokenData.access_token}`;
          }
        }
      } catch (_) {}
    }
    const res = await fetch(`${PAGOTIC_API_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify(requestBody)
    });
    if (res.ok) {
      const data = await res.json();
      paymentUrl = String(data.payment_url ?? "");
      reference = String(data.reference ?? reference);
    }
  } catch (_) {}
  if (!paymentUrl) {
    paymentUrl = `${PAGOTIC_API_URL}/pay/${reference}`;
  }
  const { data: inserted, error } = await supabase
    .from("pagotic_transactions")
    .insert({
      user_id: requestBody.user_id,
      publication_id: requestBody.publication_id,
      amount: requestBody.amount,
      currency: requestBody.currency,
      status: "pending",
      payment_url: paymentUrl,
      reference
    })
    .select("*")
    .single();
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({
    success: true,
    payment_url: paymentUrl,
    transaction_db_id: inserted.id,
    reference: inserted.reference,
    status: inserted.status
  }), { headers: { "Content-Type": "application/json" } });
});
