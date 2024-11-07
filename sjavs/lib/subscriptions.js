// lib/subscriptions.js

import { supabase } from './supabaseClient';

export function subscribeToGame(gameId, onUpdate) {
    return supabase
        .from(`games:id=eq.${gameId}`)
        .on('UPDATE', payload => {
            onUpdate(payload.new.state);
        })
        .subscribe();
}

export function unsubscribeFromGame(subscription) {
    subscription.unsubscribe();
}
