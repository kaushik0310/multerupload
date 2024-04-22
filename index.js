const express = require("express");
const multer = require("multer");
//const uuid = require("uuid").v4;
const app = express();

//single file upload
// const upload = multer({ dest: "uploads/"});
// app.post("/upload", upload.single("file"), (req,res)=>{
//     res.json({status: "success"});
// });

//multiple file upload and putting limit
// const upload = multer({ dest: "uploads/"});
// app.post("/upload", upload.array("file",2), (req,res)=>{
//     res.json({status: "success"});
// })

//different field upload
// const upload = multer({ dest: "uploads/"});

// const multiUpload = upload.fields([
//     {name: "avatar", maxCount: 1},
//     {name:"resume", maxCount: 1},
// ]);
// app.post("/upload", multiUpload, (req,res)=>{
//     console.log(req.files);
//     res.json({status: "success"});
// })

//custom filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    //cb(null, `${uuid()}-${originalname}`)
    cb(null, `${Date.now()}-${originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000, files: 2 },
});
//const upload = multer({ dest: "uploads/"});
app.post("/upload", upload.array("file"), (req, res) => {
  console.log(req.files);
  res.json({ status: "success" });
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.json({
        message: "file is too large",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.json({
        message: "file limit reached",
      });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.json({
        message: "file must be an image",
      });
    }
  }
});

app.listen(4000, () => console.log("listening on port 4000"));
