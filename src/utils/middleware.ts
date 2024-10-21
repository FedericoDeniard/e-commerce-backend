import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);

  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send("Unauthorized");
      return;
    }
    req.user = decoded;
    next();
  });
};
