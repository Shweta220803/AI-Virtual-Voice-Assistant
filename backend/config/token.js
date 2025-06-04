import jwt from "jsonwebtoken";

// generate token
const generateToken = async (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.log(error);
    console.error("JWT Generation Error:", error);
    throw new Error("Token generation failed"); // Optional: handle it where this is called
  }
};

export default generateToken;
