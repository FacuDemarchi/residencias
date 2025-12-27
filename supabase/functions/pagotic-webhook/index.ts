import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  }
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const payload = await req.json();
  const id = payload.id ? String(payload.id) : null;
  const reference = payload.reference ? String(payload.reference) : null;
  const status = String(payload.status ?? "");
  if (!status || (!id && !reference)) {
    return new Response(JSON.stringify({ success: false, error: "Invalid payload" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  let query = supabase.from("pagotic_transactions").update({ status, updated_at: new Date().toISOString() });
  if (id) {
    query = query.eq("id", id);
  } else {
    query = query.eq("reference", reference!);
  }
  const { error } = await query;
  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
});
