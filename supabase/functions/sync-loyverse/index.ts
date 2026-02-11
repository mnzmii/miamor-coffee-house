// Miamor Coffee House — Loyverse Sync Edge Function
// Deploy to Supabase Edge Functions when ready
//
// Setup:
// 1. supabase functions new sync-loyverse
// 2. supabase secrets set LOYVERSE_API_TOKEN=your-token-here
// 3. supabase functions deploy sync-loyverse

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { reservation_id } = await req.json()

        if (!reservation_id) {
            return new Response(
                JSON.stringify({ error: 'reservation_id is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Initialize Supabase client
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Fetch reservation with items and room
        const { data: reservation, error: resError } = await supabase
            .from('reservations')
            .select(`
        *,
        rooms ( name ),
        reservation_items (
          quantity,
          menu_items ( name, price, loyverse_variant_id )
        )
      `)
            .eq('id', reservation_id)
            .single()

        if (resError || !reservation) {
            return new Response(
                JSON.stringify({ error: 'Reservation not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Build Loyverse order payload
        const lineItems = reservation.reservation_items
            .filter((item) => item.menu_items?.loyverse_variant_id)
            .map((item) => ({
                variant_id: item.menu_items.loyverse_variant_id,
                quantity: item.quantity,
                price: parseFloat(item.menu_items.price),
            }))

        const loyversePayload = {
            type: 'OPEN',
            note: `${reservation.customer_name} | ${reservation.rooms?.name || 'No Room'} | ${reservation.guest_count} pax`,
            line_items: lineItems,
        }

        // POST to Loyverse API
        const loyverseToken = Deno.env.get('LOYVERSE_API_TOKEN')

        if (!loyverseToken) {
            return new Response(
                JSON.stringify({ error: 'LOYVERSE_API_TOKEN not configured' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const loyverseRes = await fetch('https://api.loyverse.com/v1.0/orders', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${loyverseToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loyversePayload),
        })

        if (!loyverseRes.ok) {
            const errorBody = await loyverseRes.text()
            console.error('Loyverse API error:', errorBody)
            return new Response(
                JSON.stringify({ error: 'Loyverse sync failed', details: errorBody }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const loyverseOrder = await loyverseRes.json()

        // Mark reservation as synced
        await supabase
            .from('reservations')
            .update({ is_synced: true })
            .eq('id', reservation_id)

        return new Response(
            JSON.stringify({ success: true, loyverse_order_id: loyverseOrder.id }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (err) {
        console.error('Error:', err)
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
