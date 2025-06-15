const {
  postLogin,
  postSignup,
  postSendOtp,
  postResetPassword,
  updateUser,
  postVerifyOtp,
} = require("../controllers/auth.controller");
const { signupValidator } = require("../validators/user.validator");

const router = require("express").Router();

router.post("/signup", signupValidator, postSignup);
router.put("/signup/:user_id", updateUser);
router.post("/login", postLogin);
router.post("/send-otp", postSendOtp);
router.post("/reset-password", postResetPassword);
router.post("/verify-otp", postVerifyOtp);

module.exports = router;
