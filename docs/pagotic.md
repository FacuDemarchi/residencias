# Integración Pago TIC

- Edge Functions:
  - `pagotic-create-payment`: crea pago único y registra transacción en `pagotic_transactions`.
  - `pagotic-create-subscription`: crea suscripción mensual y registra transacción.
  - `pagotic-webhook`: recibe eventos y actualiza estado de la transacción.
- Variables de entorno (Supabase):
  - `SB_URL` (usa esto en lugar de `SUPABASE_URL`)
  - `SB_SERVICE_ROLE_KEY` (usa esto en lugar de `SUPABASE_SERVICE_ROLE_KEY`)
  - `PAGOTIC_API_URL` (p. ej. `https://api.pagotic.com`)
  - `PAGOTIC_API_KEY` (token de API de Pago TIC) o flujo OAuth:
    - `PAGOTIC_CLIENT_ID`
    - `PAGOTIC_CLIENT_SECRET`
- Despliegue:
  - `supabase functions deploy pagotic-create-payment --no-verify-jwt`
  - `supabase functions deploy pagotic-create-subscription --no-verify-jwt`
  - `supabase functions deploy pagotic-webhook --no-verify-jwt`
- Webhook:
  - Configurar en el dashboard de Pago TIC:
    - URL: `https://<project-ref>.supabase.co/functions/v1/pagotic-webhook` (tu caso: `https://pxjeifzojuckaknwlwgp.supabase.co/functions/v1/pagotic-webhook`)
    - Eventos: `payment.completed`, `payment.failed`, `payment.cancelled`, `subscription.created`, `subscription.cancelled`
    - Método: `POST`, Content-Type: `application/json`
    - Payload mínimo: `{ "reference": "<ref>", "status": "<completed|failed|cancelled>" }`
    - Opcional: `{ "id": "<transaction_db_id>" }`

## Esquema y RLS

- Archivo SQL: `supabase/sql/pagotic_transactions_policies.sql`
  - Crea la tabla `pagotic_transactions` si no existe
  - Agrega trigger `updated_at`
  - Habilita RLS
  - Política de lectura propia (`authenticated` puede leer sus transacciones)
  - Escritura sólo vía Edge Functions (service role)
- Deploy:
  - `supabase db push` (desde el root del proyecto) para aplicar cambios de esquema/políticas

## Manejo de errores y timeouts
- `CheckoutPage`:
  - Muestra CTA de login si no hay sesión
  - Reintento en errores de creación de pago/suscripción
  - Timeout de polling tras 24 intentos (~2 min)
  - Mensajes de error más claros en UI
- Contratos esperados:
  - Create Payment/Subscription request:
    - `publication_id`, `user_id`, `amount`, `currency`, `description`, `return_url`, `cancel_url`, `interval?`
  - Respuesta:
    - `success`, `payment_url`, `transaction_db_id`, `reference`, `status`
  - Webhook payload:
    - `id?`, `reference?`, `status`
- Frontend:
  - `PagoticService.createPayment` invoca `pagotic-create-payment`.
  - `PagoticService.createSubscription` invoca `pagotic-create-subscription`.
  - `PagoticService.getTransactionStatus` consulta `pagotic_transactions`.
