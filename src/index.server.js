const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//routes
const authRoutes = require("./routes/auth"); //user routes
const adminRoutes = require("./routes/admin/auth"); //admin routes
const { invalidRoute } = require("./controllers/other");

//env variables or constants
dotenv.config();
const PORT = process.env.port;

// mongodb connection: mongodb+srv://<username>:<password>@cluster0.hxqnm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.hxqnm.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`,
		{
			useNewURLParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log("database connected successfully");
	});

//middlewares
// app.use(express.json());
app.use(bodyParser.json());
app.use("/api/user", authRoutes);
app.use("/api/admin", adminRoutes);

////if client hits any url which is not from the above routes, then it gives invalid route error
app.use("*", invalidRoute);

// console.log("bdkfbdfb");

app.listen(PORT, () => {
	console.log("Server is running on port", PORT);
});
