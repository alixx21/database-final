import { useEffect, useState } from "react";
import { HotelsAPI } from "../../api/hotels.api";

const emptyForm = { name: "", city: "", address: "", description: "", rating: 0 };

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await HotelsAPI.list();
      setHotels(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        name: form.name,
        city: form.city,
        address: form.address,
        description: form.description,
        rating: Number(form.rating)
      };

      if (editingId) await HotelsAPI.put(editingId, payload);
      else await HotelsAPI.create(payload);

      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (e2) {
      setError(e2.message || "Save failed");
    }
  };

  const startEdit = (h) => {
    setEditingId(h._id);
    setForm({
      name: h.name ?? "",
      city: h.city ?? "",
      address: h.address ?? "",
      description: h.description ?? "",
      rating: h.rating ?? 0
    });
  };

  const remove = async (id) => {
    setError(null);
    try {
      await HotelsAPI.remove(id);
      await load();
    } catch (e) {
      setError(e.message || "Delete failed");
    }
  };

  return (
    <div>
      <h2>Admin • Hotels</h2>

      {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}

      <form onSubmit={onSubmit} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 16 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <input placeholder="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input placeholder="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input placeholder="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="number" placeholder="rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit">{editingId ? "Update (PUT)" : "Create"}</button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {loading ? <div>Loading...</div> : (
        <div style={{ display: "grid", gap: 10 }}>
          {hotels.map((h) => (
            <div key={h._id} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{h.name}</strong>
                <span>⭐ {h.rating ?? 0}</span>
              </div>
              <div>{h.city}</div>
              <div style={{ opacity: 0.8 }}>{h.address}</div>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button onClick={() => startEdit(h)}>Edit</button>
                <button onClick={() => remove(h._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
