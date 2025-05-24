import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <h1 className="sidebar-logo">📘 Summarist</h1>
        <ul className="sidebar-nav">
          <Link href="/for-you">
            <li>For you</li>
          </Link>
          <Link href="/my-library">
            <li>My Library</li>
          </Link>
          <Link href="/highlights">
            <li>Highlights</li>
          </Link>

          <li>Search</li>
        </ul>
      </div>

      <div className="sidebar-bottom">
        <ul className="sidebar-nav">
          <Link href="/settings">
            <li>Settings</li>
          </Link>
          <li>Help & Support</li>
          <li>Logout</li>
        </ul>
      </div>
    </div>
  );
}
