const express = require("express");
const cors = require("cors");
const PORT = 9000;

const app = express();
app.use(express.json());

app.use(cors());

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
