import { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../lib/supabase.js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { session, action } = req.body; // Expecting { session: 'route_id', action: 'join' | 'leave' }

    if (!session || !action) {
        return res.status(400).json({ message: 'Invalid request: session and action are required.' });
    }

    try {
        // Fetch existing session
        const { data: existingSession, error: fetchError } = await supabase
            .from("session")
            .select("*")
            .eq("id", session)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            throw fetchError;
        }

        // Determine current player count
        let player_count = existingSession ? existingSession.player_count : 0;

        // Update player count based on action
        if (action === 'join') {
            player_count += 1;
        } else if (action === 'leave') {
            player_count = Math.max(player_count - 1, 0);
        }

        const { error: upsertError } = await supabase
        .from("session")
        .upsert(
            { 
                id: session,            // Unique session identifier dsdsads
                active: true,           // Ensure session remains active
                player_count: player_count, // Update player count
            },
            { onConflict: "id" }        // Specify conflict resolution on the "id" column
        );

        if (upsertError) {
            throw upsertError;
        }

        // Respond with updated session info
        return res.status(200).json({ session, player_count });
    } catch (error) {
        console.error("Error updating session counter:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
