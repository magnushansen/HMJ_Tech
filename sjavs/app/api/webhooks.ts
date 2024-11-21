import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { ResolvedTypeReferenceDirectiveWithFailedLookupLocations } from 'typescript';

export async function POST(req: Request) {
    const SIGNING_SECRET = process.env.SIGNING_SECRET;

    if (!SIGNING_SECRET) {
        throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
    }

    const wh = new Webhook(SIGNING_SECRET);

    // Get Headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix Headers', {
            status: 400
        });
    }

    // Get Body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    let evt: WebhookEvent;

    // Verify Payload with Headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature
        }) as WebhookEvent
    } catch (err) {
        console.log('Error: Could not verify webhook:', err);
        return new Response('Error: Verification error', {
            status: 400,
        })
    }

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    //console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    //console.log('Webhook payload:', body);

    if (evt.type === 'user.created') {
        console.log(`User with ID ${evt.data.id} deleted`)
    }
    if (evt.type === 'user.updated') {
        console.log(`User with ID ${evt.data.id} deleted`)
    }
    if (evt.type === 'user.deleted') {
        console.log(`User with ID ${evt.data.id} deleted`)
    }

    return new Response('Webhook received', {status: 200});

}