import jwt from "jsonwebtoken";

// Middleware function
const authMiddleware = async (req, res, next) => {
  const token =
    req.headers.authorization?.replace("Bearer ", "") ||
    req.headers.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized. Login again.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mySuperSecretJWTKey123!");

    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    console.error("Backend error in authMiddleware:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default authMiddleware;