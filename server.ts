import express, { Request, Response } from "express";
import getMoveArgs from "./src/main";
const app = express();
import bodyParser from "body-parser";
import cors from "cors";
app.use(cors());

// Controllers (route handlers)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 8082; // default port to listen

// define a route handler for the default home page
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
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
