import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sessionId, userId } = req.body;

    if (!sessionId || !userId) {
        return res.status(400).json({ error: 'Missing sessionId or userId' });
    }

    try {
        // Check if the session exists and game hasn't started
        const { data: sessionData, error: sessionError } = await supabase
            .from('session')
            .select('id, player_count, start_game, created_by')
            .eq('id', sessionId)
            .single();

        if (sessionError || !sessionData) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (sessionData.start_game) {
            return res.status(400).json({ error: 'Game already started' });
        }

        if (sessionData.player_count !== 4) {
            return res.status(400).json({ error: 'Game requires exactly 4 players to start' });
        }

        if (sessionData.created_by !== userId) {
            return res.status(403).json({ error: 'Only the lobby creator can start the game' });
        }

        // Update the session to mark the game as started
        const { error: updateError } = await supabase
            .from('session')
            .update({ start_game: true })
            .eq('id', sessionId);

        if (updateError) {
            throw new Error(updateError.message);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error starting game:', error.message);
        res.status(500).json({ error: error.message });
    }
}
