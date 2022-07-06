const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Posts')
const bcrypt = require('bcrypt')

//CREATE POST
router.post("/", async (req, res) => {
	//tạo model post lấy dữ liệu từ req.body
	const newPost = new Post(req.body);
	try {
		// tạo biến lưu dữ liệu vào database
		const savePost = await newPost.save();
		res.status(200).json(savePost)
	}
	catch (err) {
		//trả về error nếu lỗi
		res.status(500).json(err)
	}
})
//UPDATE POST
router.put("/:id", async (req, res) => {
	//tìm post cần update
	try {
		const post = await Post.findById(req.params.id);
		//kiểm tra tên user post và tên trên params
		if (post.username === req.body.username) {
			try {
				//thực thi tìm và update post 
				const updatePost = await Post.findByIdAndUpdate(req.params.id,
					{
						$set: req.body
					}, { new: true })
				res.status(200).json(updatePost)
			} catch (err) {
				res.status(500).json(err)
			}
		}
		else {
			res.status(401).json("you can update only one post!")
		}
	}
	catch (err) {
		res.status(500).json(err)
	}
})

//DELETE
router.delete("/:id", async (req, res) => {
	//tìm id post
	try {
		const post = await Post.findById(req.params.id);
		if (post.username === req.body.username) {
			try {
				await post.delete();
				res.status(200).json("This post was delete")
			} catch (err) {
				res.status(500).json(err)
			}
		}
		else {
			res.status(401).json("you can delete only one post!")
		}
	} catch (err) {
		res.status(500).json(err)

	}
})
//GET POST
router.get("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		

		res.status(200).json(post)
	} catch (error) {
		res.status(400).json(error)
	}
})
//GET ALL POST
//set Header Content-type :application/json
router.get("/", async (req, res) => {
	
	const username = req.query.user;
	const catname = req.query.cat;
	try {
		let posts;
		if (username) {
			posts = await Post.find({ username })
		} else if (catname) {
			posts = await Post.find({
				categories: {
					$in: [catname],
				}
			})
		}
		else {
			posts = await Post.find()
			
		}
		
		res.status(200).json(posts)

	} catch(err) {
		res.status(500).json(err)
	}
});
module.exports = router