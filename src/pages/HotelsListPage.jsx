import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HotelsAPI } from "../api/hotels.api";

export default function HotelsListPage() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hotels, setHotels] = useState([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await HotelsAPI.list({ city: city.trim() || undefined });
      setHotels(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // initial

  return (
    <div>
      <h2>Hotels</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Filter by city (optional)"
        />
        <button onClick={load} disabled={loading}>Search</button>
        <button onClick={() => { setCity(""); setTimeout(load, 0); }} disabled={loading}>
          Reset
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && (
        <div style={{ color: "crimson", marginBottom: 12 }}>
          {error} <button onClick={load}>Retry</button>
        </div>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {hotels.map((h) => (
          <div key={h._id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{h.name}</strong>
              <span>⭐ {h.rating ?? 0}</span>
            </div>
            <div>{h.city}</div>
            <div style={{ opacity: 0.8 }}>{h.address}</div>
            <div style={{ marginTop: 8 }}>
              <Link to={`/hotels/${h._id}/rooms`}>View rooms</Link>
            </div>
          </div>
        ))}
        {!loading && hotels.length === 0 && <div>No hotels found.</div>}
      </div>
    </div>
  );
}
