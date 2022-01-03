const express = require("express");
const genres = require("./routes/genres");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/genres", genres);

app.listen(port, () => console.log("Vidly is istening on port " + port));
