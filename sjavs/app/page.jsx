import Link from 'next/link';

export default function Menu() {
    return (
    <div class="h-screen bg-green-800 text-white font-sans">

      <div class="w-full text-center py-6">
        <h1 class="text-5xl font-extrabold">Sjavs</h1>
      </div>

      <div class="flex flex-col items-center justify-start h-[calc(100vh-100px)] mt-[-10px]">
        <h2 class="text-4xl font-bold mb-4">Main Menu</h2>
        <p class="text-xl mb-6">Select an option:</p>
        <ul class="space-y-4">
          <li>
            <Link
              href="pages/joinlobby"
              class="block bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
            >
              Join Lobby
            </Link>
          </li>
          <li>
            <Link
              href="pages/createlobby"
              class="block bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
            >
              Create Lobby
            </Link>
          </li>
          <li>
            <Link
              href="pages/tournament"
              class="block bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
            >
              Tournament
            </Link>
          </li>
        </ul>
      </div>
    </div>
    );
}