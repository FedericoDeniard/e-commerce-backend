import jwt from "jsonwebtoken";

export const createToken = ({ id }: { id: number }) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Debería expirar en menos tiempo e implementar Refresh Token
  });
  return token;
};
