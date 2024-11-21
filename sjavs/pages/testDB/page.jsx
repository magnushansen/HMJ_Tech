import supabase from './../../../lib/supabase.js';

async function fetchUsers() {
    try {
        const { data, error } = await supabase
            .from('user_data')
            .select('*');

        if (error) {
            console.error('Error fetching users:', error);
            return;
        }

        if (data.length === 0) {
            console.warn('No data found. Check your RLS policies or table permissions.');
        } else {
            console.log('Fetched users:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

fetchUsers();
