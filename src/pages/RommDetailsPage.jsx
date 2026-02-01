import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { RoomsAPI } from "../api/rooms.api";
import { HotelsAPI } from "../api/hotels.api";

export default function RoomDetailsPage() {
  const { roomId } = useParams();

  const [room, setRoom] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await RoomsAPI.getById(roomId);
      setRoom(r);

      if (r?.hotelId) {
        const h = await HotelsAPI.getById(r.hotelId).catch(() => null);
        setHotel(h);
      } else {
        setHotel(null);
      }
    } catch (e) {
      setError(e.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [roomId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "crimson" }}>{error} <button onClick={load}>Retry</button></div>;
  if (!room) return <div>Not found</div>;

  return (
    <div>
      <h2>Room details</h2>

      {hotel && (
        <div style={{ marginBottom: 12 }}>
          <div><strong>Hotel:</strong> {hotel.name}</div>
          <Link to={`/hotels/${hotel._id}/rooms`}>Back to hotel rooms</Link>
        </div>
      )}

      <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
        <div><strong>RoomNumber:</strong> {room.roomNumber}</div>
        <div><strong>Type:</strong> {room.type}</div>
        <div><strong>Price:</strong> ${room.pricePerNight}/night</div>
        <div><strong>Status:</strong> {room.isActive ? "Active" : "Inactive"}</div>
        <div style={{ marginTop: 10 }}>
          <strong>Amenities:</strong>{" "}
          {(room.amenities || []).length ? (room.amenities || []).map((a, i) => (
            <span key={i} style={{ marginRight: 8 }}>{String(a)}</span>
          )) : "—"}
        </div>
      </div>

      {/* Никаких booking-кнопок — это зона участника A */}
    </div>
  );
}
