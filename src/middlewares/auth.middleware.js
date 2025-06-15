const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res
      .status(401)
      .json({ EC: -999, DT: null, EM: "Access denied. No token provided." });
  }
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : null;

  if (!token) {
    return res
      .status(401)
      .json({ EC: -999, DT: null, EM: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ EC: -999, DT: null, EM: "Invalid token." });
  }
};
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.is_admin === true) {
    next();
  } else {
    res
      .status(403)
      .json({ EC: -999, DT: null, EM: "Access denied. Admins only." });
  }
};

module.exports = { auth, requireAdmin };
