import supabase from '../../../lib/supabase.js';

export default async function handler(req, res) {
  try {
    // Fetch data from the 'leaderboard' table
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*');

    if (error) throw error;

    // Send the fetched data as the response
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: error.message });
  }
}
