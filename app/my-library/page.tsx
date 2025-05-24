import Sidebar from "@/components/Sidebar";
import "/globals.css";
export default function MyLibrary() {
  return (
    <>
      <div className="dashboard-container">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div></div>
      </div>
    </>
  );
}
