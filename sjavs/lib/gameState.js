import supabase from './supabase';

// Function to fetch initial game state
export const fetchGameState = async (gameId) => {
    const { data, error } = await supabase
        .from('game_state') // The game_state table in your database
        .select('*')
        .eq('id', gameId)
        .single();

    if (error) {
        console.error('Error fetching game state:', error);
        return null;
    }

    return data;
};

// Function to update game state
export const updateGameState = async (gameId, newState) => {
    const { error } = await supabase
        .from('game_state')
        .update({ state: newState })
        .eq('id', gameId);

    if (error) {
        console.error('Error updating game state:', error);
    }
};

// Function to subscribe to game state changes
export const subscribeToGameState = (gameId, callback) => {
    const subscription = supabase
        .from(`game_state:id=eq.${gameId}`)
        .on('UPDATE', (payload) => {
            callback(payload.new.state);
        })
        .subscribe();

    return subscription;
};

// Function to remove a subscription
export const removeSubscription = (subscription) => {
    supabase.removeSubscription(subscription);
};
