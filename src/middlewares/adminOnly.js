module.exports = function adminOnly(req, res, next) {
  const adminToken = process.env.ADMIN_TOKEN || "supersecret";

  const headerToken = req.headers["x-admin-token"];

  if (!headerToken || headerToken !== adminToken) {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
};
