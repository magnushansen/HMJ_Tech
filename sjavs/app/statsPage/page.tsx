"use client";

import React, { useEffect, useState } from 'react';
import supabase from "../../lib/supabase";
import { useUser } from "@clerk/nextjs";

const StatsPage: React.FC = () => {
    const { user } = useUser(); // Get the current logged-in user from Clerk
    const [stats, setStats] = useState<any | null>(null); // State to hold user's stats
    const [loading, setLoading] = useState<boolean>(true); // State for loading status
    const [error, setError] = useState<string | null>(null); // State for error message

    // Function to fetch stats for the logged-in user
    const fetchUserStats = async (userId: string) => {
        try {
            setLoading(true); // Start loading
            const { data, error } = await supabase
                .from('user_data') // Correct table name
                .select('username, games_played, wins, losses, email') // Only select required fields
                .eq('email', "john_askham@yahoo.com") // Use the correct column name and type
                .single(); 

            if (error) {
                setError("Error fetching stats: " + error.message);
                console.error("Error fetching stats:", error);
            } else {
                setStats(data); // Store the fetched stats
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            setError("Unexpected error occurred.");
        } finally {
            setLoading(false); // End loading
        }
    };

    // Fetch the stats when the user is authenticated
    useEffect(() => {
        if (user?.id) {
            fetchUserStats(user.id); // Pass the Clerk user's ID to the fetch function
        }
    }, [user]);

    return (
        <div>
            <h1>Stats Page</h1>
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error if any */}
            {loading && <p>Loading...</p>} {/* Display loading state */}

            {!loading && stats && (
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Games Played</th>
                            <th>Wins</th>
                            <th>Losses</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{stats.username}</td>
                            <td>{stats.games_played}</td>
                            <td>{stats.wins}</td>
                            <td>{stats.losses}</td>
                        </tr>
                    </tbody>
                </table>
            )}

            {!loading && !stats && !error && <p>No stats available for this user.</p>}
        </div>
    );
};

export default StatsPage;
