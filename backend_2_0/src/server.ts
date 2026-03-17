import express from "express";
import cors from "cors";
import { analyzeRouter } from "./routes/analyze";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/analyze", analyzeRouter);

app.get("/health", (_, res) => {
    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});