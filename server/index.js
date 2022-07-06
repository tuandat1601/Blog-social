const express = require('express');
const multer = require("multer")
const path = require('path')
const mongoose = require("mongoose");
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const postRouter = require('./routes/posts')
const categoryRouter = require('./routes/categories')
const app = express();
require('dotenv').config()
let url = process.env.MONGOODB_URL

mongoose.connect(url).then(console.log("success"));
app.use(express.json())
app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/posts", postRouter)
app.use("/api/categories", categoryRouter)
app.use("/images", express.static(path.join(__dirname, "/images")));
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname,"index.html"))

	
})
let r
const storageConfig = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	      },
	      filename: (req, file, cb) => {
		cb(null, req.body.name );
		
	      },
})
const upload = multer({ storage: storageConfig })
// app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
// 	const file = req.file
// 	console.log(r)
// 	if (!file) {
// 	  const error = new Error('Please upload a file')
// 	  error.httpStatusCode = 400
// 	  return next(error)
// 	}
	
// 	res.send(file)
//       })
// const upload1 = multer({ dest: 'images' })
// app.post('/stats', upload1.single('uploaded_file'), function (req, res, next) {
// 	console.log(req.file, req.body)
//       })
app.post("/api/upload", upload.single("file"), (req, res) => {
	
	res.status(200).json("success")
})
let port = process.env.PORT
// const kittySchema = new mongoose.Schema({
// 	name: String
//       });
// const Kitten = mongoose.model('Kitten', kittySchema);
// const silence = new Kitten({ name: 'Silence' });
// console.log(silence.name);

app.listen(port)
