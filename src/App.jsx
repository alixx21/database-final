import { Link, Route, Routes, Navigate } from "react-router-dom";
import HotelsListPage from "./pages/HotelsListPage.jsx";
import HotelRoomsPage from "./pages/HotelRoomsPage.jsx";
import RoomDetailsPage from "./pages/RoomDetailsPage.jsx";
import AdminHotelsPage from "./pages/admin/AdminHotelsPage.jsx";
import AdminRoomsPage from "./pages/admin/AdminRoomsPage.jsx";

export default function App() {
  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 1000, margin: "0 auto", padding: 16 }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <Link to="/hotels">Hotels</Link>
        <Link to="/admin/hotels">Admin Hotels</Link>
        <Link to="/admin/rooms">Admin Rooms</Link>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/hotels" replace />} />

        <Route path="/hotels" element={<HotelsListPage />} />
        <Route path="/hotels/:hotelId/rooms" element={<HotelRoomsPage />} />
        <Route path="/rooms/:roomId" element={<RoomDetailsPage />} />

        <Route path="/admin/hotels" element={<AdminHotelsPage />} />
        <Route path="/admin/rooms" element={<AdminRoomsPage />} />

        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </div>
  );
}
