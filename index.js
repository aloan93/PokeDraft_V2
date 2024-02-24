const express = require("express");
const cors = require("cors");
const { apiRouter } = require("./routes/api-router");
const PORT = 9000;

const app = express();
app.use(express.json());

app.use(cors());

app.use("/api", apiRouter);

// customer errors

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
    return;
  }
  next(err);
});

// sql errors

app.use((err, req, res, next) => {
  if (err.code === "ER_DUP_ENTRY") {
    res.status(400).send({ message: "Duplicate Entry" });
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
