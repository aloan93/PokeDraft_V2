const express = require("express");
const PORT = 9001;
const { loginController } = require("./controllers/auth.controllers");

const app = express();
app.use(express.json());

app.post("/login", loginController);

// failsafe

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal Server Error");
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
