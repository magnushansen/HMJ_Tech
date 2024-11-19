import Link from "next/link";

export default function Menu() {
    return (
    <div className="h-screen bg-green-800 text-white font-sans">

        <div className="w-full text-center py-6">
            <h1 className="text-5xl font-extrabold">Sjavs</h1>
        </div>

        <div className="flex flex-col items-center justify-start h-[calc(100vh-100px)] mt-[-10px]">
            <h2 className="text-4xl font-bold mb-4">Create Lobby</h2>

            <ul className="space-y-4">
            <li>
                <button
                className="block bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
                >
                Create Public Lobby
                </button>
            </li>
            <li>
                <button
                href="pages/createlobby"
                className="block bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
                >
                Create Private Lobby
                </button>
            </li>
            <li>
                <Link
                href=".."
                className="block bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
                >
                Main Menu
                </Link>
            </li>
            </ul>
        </div>
    </div>
    );
}