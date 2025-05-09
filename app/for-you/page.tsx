import Sidebar from "@/components/Sidebar";
import "/globals.css";
import ForYouContent from "@/components/ForYouContent";
export default function ForYou() {
  return (
    <>
      <div className="dashboard-container">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div>
          <ForYouContent />
        </div>
      </div>
    </>
  );
}
