import Link from "next/link";
import React from "react";

export default function Menu() {
    return (
    <div className="h-screen bg-green-800 text-white font-sans">

    <div className="w-full text-center py-6">
        <h1 className="text-5xl font-extrabold">Sjavs</h1>
    </div>

    <div className="flex flex-col items-center justify-start h-[calc(100vh-100px)] mt-[-10px]">
        <h2 className="text-4xl font-bold mb-4">Main Menu</h2>

        <ul className="space-y-4 flex flex-col items-center">
        <li>
            <Link
            href="/joinlobby"
            className="block w-60 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
            >
            Join Lobby
            </Link>
        </li>
        <li>
            <Link
            href="/createlobby"
            className="block w-60 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
            >
            Create Lobby
            </Link>
        </li>
        <li>
            <Link
            href="/tournament"
            className="block w-60 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
            >
            Tournament
            </Link>
        </li>
        </ul>
    </div>
    </div>
    )
}