import express from "express";
import cors from "cors";
import uploadRouter from "./routes/upload";
import statusRouter from "./routes/status";
import resultsRouter from "./routes/results";

const app = express();
const PORT = process.env.PORT ?? 4000;

// Allow requests from the Next.js frontend running on localhost:3000
app.use(cors({ origin: "http://localhost:3000" }));

// Parse JSON request bodies (used by Express for non-multipart routes)
app.use(express.json());

// Health-check — useful to confirm the server is reachable before uploading
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/upload", uploadRouter);
app.use("/api/status", statusRouter);
app.use("/api/results", resultsRouter);

app.listen(PORT, () => {
  console.log(`DocViewer backend running at http://localhost:${PORT}`);
});
