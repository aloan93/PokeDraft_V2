const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = 9001;
const {
  loginController,
  tokenController,
  logoutController,
  logoutAllController,
} = require("./controllers/auth.controllers");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());

app.post("/login", loginController);

app.post("/token", tokenController);

app.delete("/logout", logoutController);

app.delete("/logoutAll", logoutAllController);

// customer errors

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
    return;
  }
  next(err);
});

// failsafe

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal Server Error");
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
