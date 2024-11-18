import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div className="log-in">
        <h2>Main Menu</h2>
      </div>

      <div className="login-options">
      <p>Select an option:</p>
        <ul>
          <li><Link href = '/signin'>Sign In</Link></li>
          <li><Link href = '/signup'>Sign Up</Link></li>
        </ul>
      </div>

    </div>
  );
}
