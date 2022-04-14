import "dotenv/config";
import express from "express";
import cors from "cors";
import initSocketServer from "./realtime/socketServer";

const app = express();
// config cors
app.use(cors());

// init port
const PORT = process.env.PORT || 5000;

//* config server realtime
const server = require("http").createServer(app);
initSocketServer(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
