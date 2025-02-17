const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandlingMiddleware = require("./middleware/errorHandlingMiddleware");

// Load environment variables
dotenv.config({
    path: "./config/config.env",
});

const app = express();

// ✅ Fix: Allow multiple origins for CORS
const allowedOrigins = [
    "https://fullstack-ecommerce-gho57s-projects.vercel.app",
    "http://sakthidev.site"
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Fix: Handle preflight OPTIONS requests
app.options("*", cors());

// ✅ Default route to check if the server is running
app.get("/", (req, res) => {
    res.status(200).json({ message: "API is running!" });
});

// Importing routes
const admin = require("./routes/adminRoutes");
const user = require("./routes/userRoutes");
const cart = require("./routes/cartRoutes");
const seller = require("./routes/sellerRoutes");
const product = require("./routes/productRoutes");
const payment = require("./routes/paymentRoutes");
const wishlist = require("./routes/wishlistRoutes");

// Routes
app.use("/api/v1/admin", admin);
app.use("/api/v1/user", user);
app.use("/api/v1/user/cart", cart);
app.use("/api/v1/seller", seller);
app.use("/api/v1/product", product);
app.use("/api/v1/payment", payment);
app.use("/api/v1/wishlist", wishlist);

// Error Handling Middleware
app.use(errorHandlingMiddleware);

module.exports = app;


//  Health Check Route for AWS
app.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy", uptime: process.uptime() });
});
