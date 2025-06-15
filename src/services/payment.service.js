const Showtime = require("../models/showtime.model");
const Discount = require("../models/discount.model");
const Payment = require("../models/payment.model");
const { default: axios } = require("axios");

const accessKey = "F8BBA842ECF85";
const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const partnerCode = "MOMO";

const createPaymentService = async (payment) => {
  try {
    return await Payment.create(payment);
  } catch (error) {
    throw new Error(error.message);
  }
};

const updatePaymentService = async (id, payment) => {
  try {
    return await Payment.findByIdAndUpdate(id, payment, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPaymentsService = async () => {
  try {
    const payments = await Payment.find()
      .populate("user_id")
      .populate({
        path: "show_time_id",
        populate: [
          {
            path: "film_id",
            populate: { path: "category_id", model: "Category" },
          },
          { path: "branch_id", model: "Branch" },
        ],
      });

    return payments;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getPaymentByShowTimeIdService = async (show_time_id) => {
  try {
    return await Payment.find({ show_time_id })
      .populate({
        path: "show_time_id",
        populate: [
          { path: "film_id", populate: { path: "category_id" } },
          { path: "branch_id" },
        ],
      })
      .populate("user_id");
  } catch (error) {
    throw new Error(error.message);
  }
};

const paymentWithMomoService = async (payment) => {
  const {
    show_time_id,
    list_seat,
    total_price,
    discount,
    paid_amount,
    user_id,
    discount_id
  } = payment;
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  var orderInfo = "pay with MoMo";
  var redirectUrl = "http://localhost:5173/transaction-status";
  // var redirectUrl = "https://booking-film.onrender.com/transaction-status";
  // var ipnUrl = `https://9bf3-2405-4803-c684-9240-7997-6ba2-5618-cb1b.ngrok-free.app/api/v1/payment/callback`; //fix ngrok
    var ipnUrl = `https://da76-2402-800-63a6-9639-4c0-67ec-3866-b714.ngrok-free.app/api/v1/payment/callback`; //fix ngrok
  var requestType = "payWithMethod";

  var amount = paid_amount;
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;
  var extraData = JSON.stringify({
    show_time_id,
    list_seat,
    total_price,
    discount,
    paid_amount,
    user_id,
    discount_id,
  });
  var autoCapture = true;
  var lang = "vi";

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //puts raw signature
  console.log("--------------------RAW SIGNATURE 1----------------");
  console.log(rawSignature);
  //signature
  const crypto = require("crypto");
  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");
  console.log("--------------------SIGNATURE----------------");
  console.log(signature);

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    signature: signature,
  });
  const options = {
    port: 443,
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };
  let rs;
  try {
    rs = await axios(options);
    return {
      status: rs.status,
      data: rs.data,
    };
  } catch (error) {
    console.log("error", error);
    throw new Error(error.message);
  }
};

const callBackMoMoService = async (data) => {
  try {
    // Xác thực chữ ký MoMo để đảm bảo callback hợp lệ
    const crypto = require("crypto");
    const rawSignature = `accessKey=${accessKey}&amount=${data.amount}&extraData=${data.extraData}&message=${data.message}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&orderType=${data.orderType}&partnerCode=${partnerCode}&payType=${data.payType}&requestId=${data.requestId}&responseTime=${data.responseTime}&resultCode=${data.resultCode}&transId=${data.transId}`;
    const generatedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    if (generatedSignature !== data.signature) {
      throw new Error("Invalid signature from MoMo");
    }

    console.log("valid Signtature from MoMo");

    if (data.resultCode !== 0) {
      console.log("Payment failed", data.message);
      return { success: false, message: "Payment failed" };
    }
    console.log("Extra data:", data.extraData);
    const {
      user_id,
      show_time_id,
      list_seat,
      total_price,
      discount,
      paid_amount,
      discount_id,
    } = JSON.parse(data.extraData);
    await createPaymentService({
      user_id,
      show_time_id,
      list_seat,
      total_price,
      discount,
      paid_amount,
    });
    // 2. Cập nhật các ghế đã đặt vào Showtime.booked_seats
    await Showtime.findByIdAndUpdate(show_time_id, {
      $addToSet: { booked_seats: { $each: list_seat } }  // tránh thêm trùng
    });

    if (discount_id) {
      const discount = await Discount.findById(discount_id);
      if (!discount) {
        console.warn("⚠️ Không tìm thấy discount với id:", discount_id);
      } else {
        console.log("🧾 Trước khi giảm:", discount.quantity);
        if (discount.quantity > 0) {
          discount.quantity -= 1;
          await discount.save();
          console.log("✅ Đã giảm. Còn lại:", discount.quantity);
        } else {
          console.log("⚠️ Voucher đã hết lượt sử dụng.");
        }
      }
    }
  } catch (error) {
    console.error("Error in MoMo callback:", error.message);
    return { success: false, message: error.message };
  }
};

module.exports = {
  createPaymentService,
  updatePaymentService,
  getPaymentsService,
  getPaymentByShowTimeIdService,
  paymentWithMomoService,
  callBackMoMoService,
};
