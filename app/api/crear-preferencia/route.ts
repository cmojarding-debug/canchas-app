import { MercadoPagoConfig, Preference } from 'mercadopago'
import { NextResponse } from 'next/server'

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
})

export async function POST(req: Request) {
  const { canchaId, canchaNombre, precio, fecha, horaInicio, horaFin } = await req.json()

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const preference = await new Preference(client).create({
    body: {
      items: [
        {
          id: canchaId,
          title: `Reserva ${canchaNombre} - ${fecha} ${horaInicio}-${horaFin}`,
          quantity: 1,
          unit_price: precio,
          currency_id: 'MXN',
        }
      ],
      back_urls: {
        success: `${baseUrl}/dashboard?pago=exitoso`,
        failure: `${baseUrl}/dashboard?pago=fallido`,
        pending: `${baseUrl}/dashboard?pago=pendiente`,
      },
    }
  })

  return NextResponse.json({ init_point: preference.init_point })
}
