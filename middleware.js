require("dotenv").config({ path: `${__dirname}/.env` });
const jwt = require("jsonwebtoken");
const { allowedOrigins } = require("./config/allowOrigins");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).send({ message: "No access token provided" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send({ message: "Invalid access token" });
    req.user = user;
    next();
  });
};

exports.credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};
