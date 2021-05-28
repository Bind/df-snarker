import express, { Request, Response } from "express";
import getMoveArgs from "./src/main";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const hostname = process.env.HOST || "localhost";
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8082;

app.post("/move", async (req: Request, res: Response) => {
  const respBody = await getMoveArgs(
    req.body.x1,
    req.body.y1,
    req.body.x2,
    req.body.y2,
    req.body.r,
    req.body.distMax
  );
  res.json(respBody);
});

// start the Express server
app.listen(port, hostname, () => {
  console.log(`server started at http://${hostname}:${port}`);
});
