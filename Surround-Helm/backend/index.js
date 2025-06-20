const express = require("express");
var cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const connectDB = require("./db");
// const { chats } = require("./data/data");
const app = express();

app.use(cors());
dotenv.config();
connectDB();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send("Hello World! API is running.");
});

// Ensure the uploads directory existsAdd commentMore actions
const ensureUploadsDirectoryExists = () => {
  const dir = path.join(__dirname, "uploads");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureUploadsDirectoryExists();

// Route to handle file uploads
app.post("/upload", (req, res) => {
  res.send({ filePath: `/uploads/${req.file.filename}` });
});

// app.get("/about", (req, res) => {
//   res.send("Hello about");
// });

// app.get("/contact", (req, res) => {
//   res.send("Hello ktm");
// });
// app.get("/chats", (req, res) => {
//   res.send({ chats });
// });
// app.get("/chats/:id", (req, res) => {
//   //   console.log(req.params.id);
//   const singleChat = chats.find((chat) => chat._id == req.params.id);
//   res.send({ singleChat });
// });
app.use("/api/auth", require("./routes/Auth"));
console.log("Attempting to load product routes...");
app.use("/api/product", require("./routes/Products"));
console.log("Product routes loaded successfully!");

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
