import Sidebar from "@/components/Sidebar";
import ForYouContent from "@/components/ForYouContent";
import SearchBar from "@/components/SearchBar";
export default function ForYou() {
  return (
    <>
      <div className="dashboard-container">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div>
          <SearchBar />
        </div>
        <div>
          <ForYouContent />
        </div>
      </div>
    </>
  );
}
