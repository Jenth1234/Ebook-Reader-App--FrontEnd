const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
// const { storage } = require('firebase'); 
const app = express();
app.use(cors());
app.use(express.json());
// app.use("/files", express.static("files"));
// app.use("/files", express.static("files"));
const PORT = process.env.PORT || 8080;
//http://localhost:8080/

const schemaData = mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  description: String,
  image: String,
  file: String,
  //view:number,
}, { timestamps: true });

const schemaTk = mongoose.Schema({
  account: String,
  password: String,
  ten: String,
  email: String,
  sdt: String,
}, { timestamps: true });

const booksModel = mongoose.model("books", schemaData);
const accountModel = mongoose.model("accounts", schemaTk);

app.use((req, res, next) => {
  console.log(`Received request from: ${req.connection.remoteAddress} - ${req.method} ${req.url}`);
  next();
});
// Khởi tạo multer để xử lý tệp được tải lên từ máy tính của người dùng
const upload = multer({ storage: multer.memoryStorage() });

// Định nghĩa endpoint POST để tải tệp lên Firebase Storage
app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const storageRef = await storage.ref();
    const fileRef = await storageRef.child(`pdfs/${file.originalname}`);
    await fileRef.put(file.buffer);
    
    return res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ error: 'Internal server error' });

  }
});



// Đọc dữ liệu sách
app.get("/books", async (req, res) => {
  try {
    const data = await booksModel.find({});
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tạo mới sách
app.post("/books", async (req, res) => {
  try {
    const data = new booksModel(req.body);
    await data.save();
    res.send({ success: true, message: "Data saved successfully", data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cập nhật sách
app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ...rest } = req.body;
    const data = await booksModel.findByIdAndUpdate(id, rest);
    res.send({ success: true, message: "Data updated successfully", data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Xóa sách
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await booksModel.findByIdAndDelete(id);
    res.send({ success: true, message: "Data deleted successfully", data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Đọc dữ liệu tài khoản
app.get("/accounts", async (req, res) => {
  try {
    const data = await accountModel.find({});
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tạo mới tài khoản
app.post("/accounts", async (req, res) => {
  try {
    const data = new accountModel(req.body);
    await data.save();
    res.send({ success: true, message: "Data saved successfully", data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cập nhật tài khoản
app.put("/accounts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ...rest } = req.body;
    const data = await accountModel.findByIdAndUpdate(id, rest);
    res.send({ success: true, message: "Data updated successfully", data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Xóa tài khoản
app.delete("/accounts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await accountModel.findByIdAndDelete(id);
    res.send({ success: true, message: "Data deleted successfully", data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

mongoose.connect("mongodb://127.0.0.1:27017/app")
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
