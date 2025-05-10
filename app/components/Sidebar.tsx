export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <h1 className="sidebar-logo">📘 Summarist</h1>
        <ul className="sidebar-nav">
          <li>For you</li>
          <li>My Library</li>
          <li>Highlights</li>
          <li>Search</li>
        </ul>
      </div>

      <div className="sidebar-bottom">
        <ul className="sidebar-nav">
          <li>Settings</li>
          <li>Help & Support</li>
          <li>Login</li>
        </ul>
      </div>
    </div>
  );
}
