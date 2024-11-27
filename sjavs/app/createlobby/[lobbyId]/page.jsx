'use client';

export default function LobbyPage({ params }) {
    const { lobbyId } = params; // Get lobbyId from the URL

    return (
        <div className="h-screen bg-green-800 text-white font-sans">
            <div className="w-full text-center py-6">
                <h1 className="text-5xl font-extrabold">Lobby ID: {lobbyId}</h1>
            </div>
            <div className="flex flex-col items-center justify-start h-[calc(100vh-100px)] mt-[-10px]">
                <p className="text-lg mb-6">Share this lobby ID with your friends to join the game!</p>
                <button
                    className="block w-48 bg-red-500 hover:bg-red-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
                    onClick={() => {
                        alert('Leave Lobby functionality goes here');
                    }}
                >
                    Leave Lobby
                </button>
            </div>
        </div>
    );
}
