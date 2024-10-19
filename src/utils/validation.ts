import { prisma } from "../database/create.js";
import jwt from "jsonwebtoken";

export const findUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  return user;
};

export const checkUser = async (username: string, password: string) => {
  const user = await findUsername(username);
  if (!user) return null;
  if (user.password !== password) {
    return null;
  }
  return user;
};

export const createToken = ({ id, role }) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" }); // Esto debería durar menos, y refrescarse con refresh token
