import supabase from '../../../lib/supabase';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        try {
            // Insert into Supabase
            const { data, error } = await supabase.from('users').insert([
                { username, email, password },
            ]);

            if (error) {
                console.error('Supabase Error:', error);
                return res.status(500).json({ message: error.message });
            }

            return res.status(200).json({ message: 'Signup successful!', data });
        } catch (err) {
            console.error('Unexpected Error:', err.message);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
