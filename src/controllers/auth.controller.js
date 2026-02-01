const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/password");
const { secret, expiresIn } = require("../config/jwt");

// ========================
// REGISTER (USER)
// ========================
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "fullName, email, password required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      fullName,
      email,
      passwordHash,
      role: "USER"
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      secret,
      { expiresIn }
    );

    return res.status(201).json({
      message: "User registered",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

// ========================
// REGISTER ADMIN
// ========================
exports.registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, adminSecret } = req.body;

    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Invalid admin secret" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await hashPassword(password);

    const admin = await User.create({
      fullName,
      email,
      passwordHash,
      role: "ADMIN"
    });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      secret,
      { expiresIn }
    );

    return res.status(201).json({
      message: "Admin registered",
      token,
      user: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

// ========================
// LOGIN (USER + ADMIN)
// ========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await comparePassword(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      secret,
      { expiresIn }
    );

    return res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};
