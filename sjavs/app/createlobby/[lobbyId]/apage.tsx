'use client';

import { useRouter } from "next/navigation"; // For programmatic navigation
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import supabase from '../../../lib/supabase'; // Import your Supabase client

export default function LobbyPage() {
    const params = useParams() as { lobbyId: string };
    const { lobbyId } = params; // Get lobbyId from the URL
    const router = useRouter();

    const [isValidLobby, setIsValidLobby] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [playerCount, setPlayerCount] = useState(0);

    const updateUserCount = async (action: 'join' | 'leave') => {
        try {
            console.log('Calling trackUsers API:', { session: lobbyId, action });
    
            const response = await fetch('/api/trackUsers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session: lobbyId, action }),
            });
    
            const data = await response.json();
    
            console.log('Response from trackUsers API:', data);
    
            if (data.player_count !== undefined) {
                setPlayerCount(data.player_count); // Use the correct key from the API response
            } else {
                console.error('API did not return player_count');
            }
        } catch (error) {
            console.error(`Failed to update user count: ${action}`, error);
        }
    };
    

    useEffect(() => {
        const validateLobby = async () => {
            console.log("Validating lobby with ID:", lobbyId); // Log the lobbyId
    
            try {
                const { data, error } = await supabase
                    .from("session")
                    .select("id, player_count")
                    .eq("id", lobbyId)
                    .single();
    
                console.log("Supabase response:", { data, error }); // Log the response
    
                if (error || !data || data.id !== Number(lobbyId)) {
                    console.log("Lobby not found, redirecting...");
                    router.push("/createlobby"); // Redirect if invalid
                } else {
                    console.log("Valid lobby:", data);
                    setIsValidLobby(true); // Mark lobby as valid
                    setPlayerCount(data.player_count || 0);
                }
            } catch (err) {
                console.error("Unexpected error validating lobby:", err);
                router.push("/createlobby");
            } finally {
                setIsLoading(false); // Stop loading
            }
        };
    
        validateLobby();
        updateUserCount('join');
        return () => {
            updateUserCount('leave');
        };
    }, [lobbyId, router]);
    


    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-green-800 text-white font-sans">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    if (!isValidLobby) {
        return null; // Avoid rendering if the lobby is invalid
    }

    return (
        <div className="h-screen bg-green-800 text-white font-sans">
            <div className="w-full text-center py-6">
                <h1 className="text-5xl font-extrabold">
                Lobby ID: {lobbyId} | Player Count: {playerCount}
                </h1>
            </div>
            <div className="flex flex-col items-center justify-start h-[calc(100vh-100px)] mt-[-10px]">
                <p className="text-lg mb-6">Share this lobby ID with your friends to join the game!</p>
                <button
                    onClick={() => router.push("/")}
                    className="block w-48 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105 mt-4"
                >
                    Main Menu
                </button>
            </div>
        </div>
    );
}
