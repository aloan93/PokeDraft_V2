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
const { corsOptions } = require("./config/corsOptions");
const { credentials } = require("./middleware");

const app = express();
app.use(express.json());

// handle options credentials check - BEFORE CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
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
