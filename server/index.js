const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router")


require('dotenv').config();

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitChanges } = require("./controllers/commit");
const { pushChanges } = require("./controllers/push");
const { pullChanges } = require("./controllers/pull");
const { revertChanges } = require("./controllers/revert");
const { log } = require("console");

yargs(hideBin(process.argv))
  .command("start", "Start the server", {}, startServer)
  .command("init", "Initialize a new repository", {}, initRepo)
  .command(
    "add <file>",
    "Add a new file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "The file to add",
        type: "string",
      });
    },
    (argv) => addRepo(argv.file)
  )
  .command(
    "commit <message>",
    "Commit changes to the repository",
    (yargs) => {
      yargs.positional("message", {
        describe: "The commit message",
        type: "string",
      });
    },
    (argv) => commitChanges(argv.message)
  )
  .command("push", "Push changes to the remote repository", {}, pushChanges)
  .command("pull", "Pull changes from the remote repository", {}, pullChanges)
  .command(
    "revert <commitID>",
    "Revert to a previous commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "The commit to revert to",
        type: "string",
      });
    },
    (argv) => revertChanges(argv.commitID)
  )
  .demandCommand(1, "You need at least one command before moving on")
  .help().argv;


  function startServer() {
    console.log("Server started...");
    const app = express();
    const PORT = process.env.PORT || 8080;

    app.use(bodyParser.json());
    app.use(express.json());

    const mongoURI = process.env.MONGODB_URI;

    mongoose
      .connect(mongoURI)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
      });

    app.use(cors(origin="*"));

    app.use("/", mainRouter);


    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      socket.on("join_room", (userID) => {
        user = userID;
        console.log("----------------------------------");
        console.log("User Joined Room: ", userID);
        console.log("----------------------------------");
        socket.join(userID);
      });
    });

    const db = mongoose.connection;
    db.once("open", async () => {
      console.log("MongoDB database connection established successfully");
    });

    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  };