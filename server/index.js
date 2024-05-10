const jwt = require('jsonwebtoken')
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
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
  view: { type: Number, default: 0 } ,
  
}, { timestamps: true });

const schemaTk = mongoose.Schema({
  account: String,
  password: String,
  tokenUser:String,
  ten: String,
  email: String,
  sdt: String,
  favourite: {
        type: Array,
        default: []
    },
    address: [{ type: mongoose.Types.ObjectId, ref: 'Address' }],
    wishlist: [{ type: mongoose.Types.ObjectId, ref: 'books' }],
    isBlocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    },
    passwordChangedAt: {
        type: String
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: String
    }
 
}, { timestamps: true });
const SchemaAdmin = mongoose.Schema({
  account: String,
  password: String,
  tokenUser:String,
  ten: String,
  email: String,
  sdt: String,
 
 
}, { timestamps: true });
const adminModel = mongoose.model("admins", SchemaAdmin);
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

// Thêm sách vào danh sách yêu thích của người dùng
app.post("/accounts/:accountId/favorite-books/:bookId", async (req, res) => {
  try {
    const { accountId, bookId } = req.params;
    // Tìm kiếm tài khoản người dùng trong cơ sở dữ liệu
    const user = await accountModel.findById(accountId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    // Kiểm tra xem sách đã tồn tại trong danh sách yêu thích của người dùng chưa
    if (user.favoriteBooks.includes(bookId)) {
      return res.status(400).json({ success: false, error: "Book already in favorites" });
    }
    // Thêm ID của sách vào mảng favoriteBooks của người dùng
    user.favoriteBooks.push(bookId);
    await user.save();
    res.json({ success: true, message: "Book added to favorites successfully", data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
// Đọc dữ liệu sách với tìm kiếm
app.get("/books", async (req, res) => {
  try {
    const { search } = req.query; // Lấy giá trị truy vấn tìm kiếm từ URL
    let query = {}; // Mặc định không có điều kiện tìm kiếm
    if (search) {
      // Tìm kiếm theo tiêu đề, tác giả, thể loại hoặc mô tả
      query = {
        $or: [
          { title: new RegExp(search, "i") }, // i: không phân biệt hoa thường
          { author: new RegExp(search, "i") },
          { genre: new RegExp(search, "i") },
          { description: new RegExp(search, "i") }
        ]
      };
    }
    const data = await booksModel.find(query);
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



// Thêm sách vào danh sách yêu thích của người dùng
app.post("/accounts/:accountId/favorite-books/:bookId", async (req, res) => {
  try {
    const { accountId, bookId } = req.params;
    const user = await accountModel.findById(accountId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    // Kiểm tra xem sách đã tồn tại trong danh sách yêu thích của người dùng chưa
    if (user.favoriteBooks.includes(bookId)) {
      return res.status(400).json({ success: false, error: "Book already in favorites" });
    }
    // Thêm ID của sách vào mảng favoriteBooks của người dùng
    user.favoriteBooks.push(bookId);
    await user.save();
    res.json({ success: true, message: "Book added to favorites successfully", data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// Lấy danh sách 5 cuốn sách có lượt view cao nhất
app.get('/books/top5', async (req, res) => {
  try {
    const topBooks = await booksModel.find().sort({ view: -1 }).limit(5);
    res.json({ success: true, data: topBooks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
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

// Sử dụng bodyParser để phân tích nội dung của yêu cầu HTTP
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Sử dụng Cors để xử lý CORS
app.use(cors());
// Sử dụng express-session
app.use(session({
  secret: 'secret_key_here', // Chuỗi bí mật được sử dụng để ký và mã hóa phiên
  resave: false, // Không lưu lại phiên nếu không có sự thay đổi
  saveUninitialized: true, // Lưu phiên ngay cả khi không có dữ liệu nào được lưu
  cookie: { secure: false } // Thiết lập cấu hình cookie (trong môi trường production, nên sử dụng secure: true để chỉ gửi cookie qua HTTPS)
}));

// endpoint đăng nhập
app.post("/loginadmin", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Kiểm tra xem email và password 
    const user = await adminModel.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    console.log(user.ten);
   
    
   

  
    // Trả về thông tin tài khoản hoặc token đăng nhập
    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
// endpoint đăng nhập
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Kiểm tra xem email và password 
    const user = await accountModel.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    console.log(user.ten);
   
    
   

  
    // Trả về thông tin tài khoản hoặc token đăng nhập
    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

 
});
// Endpoint đổi mật khẩu
app.put("/accounts/:id/change-password", async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Tìm kiếm người dùng trong cơ sở dữ liệu
    const user = await accountModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Kiểm tra mật khẩu cũ
    const isOldPasswordCorrect = await user.isCorrectPassword(oldPassword);
    if (!isOldPasswordCorrect) {
      return res.status(401).json({ success: false, error: "Incorrect old password" });
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;
    user.passwordChangedAt = new Date(); // Cập nhật thời gian mật khẩu đã được thay đổi
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
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