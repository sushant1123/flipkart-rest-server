const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

//import routes
const authRoutes = require("./routes/auth"); //user routes
const adminRoutes = require("./routes/admin/auth"); //admin routes
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const { invalidRoute } = require("./controllers/other");
const cartRoutes = require("./routes/cart");
const intitialDataRoute = require("./routes/admin/initialData");
const pageRoutes = require("./routes/admin/page");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");

//import middleware
const morgan = require("morgan");
const errorLogger = require("./utilities/errorLogger");

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
let LogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
	flags: "a",
});
app.use(morgan("combined", { stream: LogStream }));
app.use(express.json());
app.use(cors());
app.use("/public", express.static(path.join(__dirname, "uploads")));

//routes
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", intitialDataRoute);
app.use("/api", pageRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
////if client hits any url which is not from the above routes, then it gives invalid route error
// app.use("*", invalidRoute);

//if there is any error
app.use(errorLogger);

app.listen(PORT, () => {
	console.log("Server is running on port", PORT);
});
