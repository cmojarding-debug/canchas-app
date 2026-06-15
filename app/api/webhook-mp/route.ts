import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: Request) {
  const body = await req.json()

  if (body.type === 'payment') {
    const paymentId = body.data?.id

    if (!paymentId) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    // Consultar el pago en Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      }
    })

    const payment = await mpRes.json()

    if (payment.status === 'approved') {
      const canchaId = payment.additional_info?.items?.[0]?.id

      if (canchaId) {
        await supabase
          .from('reservas')
          .update({ 
            estado: 'confirmada',
            mp_payment_id: String(paymentId)
          })
          .eq('cancha_id', canchaId)
          .eq('estado', 'pendiente')
          .order('created_at', { ascending: false })
          .limit(1)
      }
    }
  }

  return NextResponse.json({ ok: true })
}
