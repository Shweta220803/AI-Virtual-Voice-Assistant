import jwt from "jsonwebtoken"

//  auth middleware
export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    console.log("TOKEN FROM COOKIE:", token); // log to check

    if (!token || typeof token !== 'string') {
      return res.status(401).json({
        message: "Authentication error",
        error: "jwt must be a string or is missing",
      });
    }

    // Verify JWT
    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userId;

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Authentication error",
      error: error.message,
    });
  }
};
