import Link from 'next/link';

export default function Menu() {
    return (
<div className="h-screen bg-green-800 flex flex-col items-center justify-center text-white font-sans">
  <h2 className="text-4xl font-bold mb-4">Main Menu</h2>
  <p className="text-xl mb-6">Select an option:</p>
  <ul className="space-y-4">
    <li>
      <Link
        href="pages/joinlobby"
        className="block bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
      >
        Join Lobby
      </Link>
    </li>
    <li>
      <Link
        href="pages/createlobby"
        className="block bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
      >
        Create Lobby
      </Link>
    </li>
    <li>
      <Link
        href="pages/tournament"
        className="block bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
      >
        Tournament
      </Link>
    </li>
  </ul>
</div>

    );
}