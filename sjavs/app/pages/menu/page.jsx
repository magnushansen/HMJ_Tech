import Link from 'next/link';

export default function Home() {
    return (
        <div>
        <div className="main-menu">
            <h2>Main Menu</h2>
        </div>

        <div className="menu-options">
        <p>Select an option:</p>
            <ul>
            <li><Link href = '/joinlobby'>Join Lobby</Link></li>
            <li><Link href = '/createlobby'>Create Lobby</Link></li>
            <li><Link href = '/tournament'>Tournament</Link></li>
            </ul>
        </div>

        </div>
    );
}