import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";

const protect = (req, res, next) => {

  
  try {
    const token =
      req.cookies.accessToken ||
      (req.headers["authorization"] &&
        req.headers["authorization"].startsWith("Bearer ") &&
        req.headers["authorization"].split(" ")[1]);
    if (!token) {
      throw new CustomError("Access token is missing or invalid", 403);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    // Handle token verification errors
    if (error.name === "TokenExpiredError") {
      return new CustomError("Token has expired. Please log in again", 401);
    }
    if (error.name === "JsonWebTokenError") {
      return new CustomError("Invalid token. Please log in again."), 403;
    }

    next(error);
  }
};

export default protect;
