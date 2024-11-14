// pages/api/[gameId].js

import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
    const { gameId } = req.query;
    const { method } = req;

    switch (method) {
        case 'GET':
            // Fetch the game state
            const { data } = await supabase.from('games').select('state').eq('id', gameId);
            res.status(200).json(data);
            break;
        case 'POST':
            // Update game state
            const { newState } = req.body;
            await supabase.from('games').update({ state: newState }).eq('id', gameId);
            res.status(200).json({ message: 'Game state updated' });
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
