import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(path.resolve(__dirname, "src")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "src", "index.html"));
});

app.listen(3000, () =>
  console.log(
    "Server kör och lyssnar på porten 3000, url: http://localhost:3000",
  ),
);
