import { prisma } from "../database/create.js";

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
  if (user.password !== password) {
    return null;
  }
  return user;
};
