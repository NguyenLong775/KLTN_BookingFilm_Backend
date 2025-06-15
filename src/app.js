require("dotenv").config();
const express = require("express");
const cors = require("cors");
const testRouter = require("./routes/test.route");
const branchRouter = require("./routes/branch.route");
const categoryRouter = require("./routes/category.route");
const showtimeRouter = require("./routes/showtime.route");
const paymentRouter = require("./routes/payment.route");
const discountRouter = require("./routes/discount.route");
const filmRouter = require("./routes/film.route");
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const zalopayRoute = require("./routes/zalopay.route");
const reviewRouter = require("./routes/review.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", testRouter);
app.use("/api/v1/branch", branchRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/showtime", showtimeRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/discount", discountRouter);
app.use("/api/v1/film", filmRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/zalopay", zalopayRoute);
app.use("/api/v1/review", reviewRouter);


module.exports = app;
