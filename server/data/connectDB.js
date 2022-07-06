const { MongoClient } = require("mongodb");
const url = 'mongodb://localhost:27017/?readPreference=primary&directConnection=true&ssl=false';
let database;
let connectDB = async () => {
	const client = await MongoClient.connect(url);
	database = client.db("blog");
	if (database) {
		console.log("connect")
	}
}

 module.exports = {connectDB:connectDB}

