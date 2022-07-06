const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Posts')
const bcrypt = require('bcrypt')

//UPDATE
router.put("/:id", async (req, res) => {
	
	if (req.body._id === req.params.id) {
	
		if (req.body.password) {
			const salt = await bcrypt.genSalt(10);
			req.body.password = await bcrypt.hash(req.body.password, salt)
		}
		try {
			const userPrev = await User.findById(req.params.id)
		
			const updatedUser =await User.findByIdAndUpdate(req.params.id, {
				$set: req.body,
			})
			console.log(req.body.userPrev)
		

				console.log(userPrev.username,updatedUser.username)
				await Post.updateMany({username:userPrev.username},
					{$set:{username:updatedUser.username}})
				res.status(200).json(updatedUser)
			
			
				console.log("wrong")
			
			
		}
		catch (error) {
			res.status(500).json(error)
		}
	} else {
		res.status(401).json("you can update only your account!")
	}
})

//DELETE
router.delete("/:id", async (req, res) => {
	if (req.body.userId === req.params.id) {

		try {
			const user = await User.findById(req.params.id)
			try {
				await Post.deleteMany({ username: user.username })
				await User.findByIdAndDelete(req.params.id)
				res.status(200).json("User has been deleted....")
			} catch (error) {
				res.status(500).json(error)
			}
		}
		catch (error) {
			res.status(404).json("User not found")
		}
	} else {
		res.status(401).json("you can delete only your account!")
	}
})
router.get("/", async (req, res) => {
	try {
		const user = await User.find();

		res.status(200).json(user)
	} catch (error) {
		res.status(400).json(error)
	}
})
//GET USER
router.get("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, ...other } = user._doc;
		res.status(200).json(other)
	} catch (error) {
		res.status(400).json(error)
	}
})
module.exports = router