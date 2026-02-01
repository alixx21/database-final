import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { RoomsAPI } from "../api/rooms.api";
import { HotelsAPI } from "../api/hotels.api";

export default function HotelRoomsPage() {
  const { hotelId } = useParams();

  const [hotelName, setHotelName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyActive, setOnlyActive] = useState(true);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [roomsData, hotel] = await Promise.all([
        RoomsAPI.list({
          hotelId,
          minPrice: minPrice === "" ? undefined : Number(minPrice),
          maxPrice: maxPrice === "" ? undefined : Number(maxPrice),
          isActive: onlyActive ? true : undefined
        }),
        HotelsAPI.getById(hotelId).catch(() => null)
      ]);
      setRooms(Array.isArray(roomsData) ? roomsData : []);
      setHotelName(hotel?.name || "");
    } catch (e) {
      setError(e.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [hotelId]); // reload on route

  return (
    <div>
      <h2>Rooms {hotelName ? `— ${hotelName}` : ""}</h2>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min price"
        />
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max price"
        />
        <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={onlyActive}
            onChange={(e) => setOnlyActive(e.target.checked)}
          />
          only active
        </label>
        <button onClick={load} disabled={loading}>Apply</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && (
        <div style={{ color: "crimson", marginBottom: 12 }}>
          {error} <button onClick={load}>Retry</button>
        </div>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {rooms.map((r) => (
          <div key={r._id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>Room {r.roomNumber} • {r.type}</strong>
              <span>${r.pricePerNight}/night</span>
            </div>
            <div style={{ marginTop: 6 }}>
              {(r.amenities || []).map((a, idx) => (
                <span key={idx} style={{ padding: "2px 8px", border: "1px solid #eee", borderRadius: 999, marginRight: 6 }}>
                  {String(a)}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 8, opacity: 0.85 }}>
              Status: {r.isActive ? "Active" : "Inactive"}
            </div>
            <div style={{ marginTop: 8 }}>
              <Link to={`/rooms/${r._id}`}>Details</Link>
            </div>
          </div>
        ))}
        {!loading && rooms.length === 0 && <div>No rooms found.</div>}
      </div>
    </div>
  );
}
