const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require("qs");
const config = require("../config/zalopay.config");
const Payment = require("../models/payment.model");
exports.createOrderZaloPay = async (req, res) => {
  try {
    const { show_time_id, list_seat, total_price, discount, paid_amount } =
      req.body;

    const app_trans_id = `${moment().format("YYMMDD")}_${Math.floor(
      Math.random() * 1000000
    )}`;

    console.log("User info:", req.user);

    const order = {
      app_id: config.app_id,
      app_trans_id,
      app_user: req.user.userId,
      app_time: Date.now(),
      amount: paid_amount,
      description: `Thanh toán vé xem phim ghế: ${list_seat.join(", ")}`,
      embed_data: JSON.stringify({
        user_id: req.user.userId,
        show_time_id,
        list_seat,
        total_price,
        discount,
        paid_amount,
        redirecturl: `http://localhost:5173/transaction-zalo`,
      }),
      item: JSON.stringify([]),
      bank_code: "zalopayapp",
      callback_url: `${config.callback_url}`,
    };

    const rawSignature = [
      order.app_id,
      order.app_trans_id,
      order.app_user,
      order.amount,
      order.app_time,
      order.embed_data,
      order.item,
    ].join("|");
    order.mac = CryptoJS.HmacSHA256(rawSignature, config.key1).toString();

    console.log("Payload gửi tới ZaloPay:", order);

    const response = await axios.post(
      "https://sb-openapi.zalopay.vn/v2/create",
      qs.stringify(order),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Phản hồi từ ZaloPay:", response.data);
    if (response.data.return_code === 1) {
      res.json({
        app_trans_id,
        zp_trans_id: response.data.zp_trans_token,
        order_url: response.data.order_url,
      });
    } else {
      throw new Error("Tạo giao dịch thất bại.");
    }
  } catch (error) {
    console.error("Lỗi tạo giao dịch:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.handleCallback = async (req, res) => {
  try {
    const { data, mac } = req.body;
    console.log("Received data from ZaloPay callback:", req.body);

    // Tạo MAC từ data dùng key2 để so sánh
    const generatedMac = CryptoJS.HmacSHA256(data, config.key2).toString();
    if (generatedMac !== mac) {
      console.error("MAC không hợp lệ!");
      return res.status(400).json({
        return_code: -1,
        return_message: "Invalid MAC",
      });
    }

    const parsedData = JSON.parse(data);
    const paymentData = JSON.parse(parsedData.embed_data);

    if (!paymentData.user_id) {
      console.error("user_id không tồn tại trong embed_data");
      return res.status(400).json({
        return_code: -1,
        return_message: "Missing user_id in embed_data",
      });
    }

    // Thay vì kiểm tra return_code, kiểm tra existence của zp_trans_id
    if (parsedData.zp_trans_id) {
      const paymentRecord = await Payment.create({
        user_id: paymentData.user_id,
        show_time_id: paymentData.show_time_id,
        list_seat: paymentData.list_seat,
        total_price: paymentData.total_price,
        discount: paymentData.discount,
        paid_amount: paymentData.paid_amount,
        app_trans_id: parsedData.app_trans_id,
        zp_trans_id: parsedData.zp_trans_id,
        status: "success",
      });

      console.log("Thanh toán thành công và đã lưu vào database:", paymentRecord);

      return res.status(200).json({
        return_code: 1,
        return_message: "success",
      });
    } else {
      console.error("Giao dịch không thành công hoặc dữ liệu không hợp lệ:", parsedData);
      return res.status(400).json({
        return_code: -1,
        return_message: "Invalid transaction data",
      });
    }
  } catch (error) {
    console.error("Error processing callback:", error);
    return res.status(500).json({
      return_code: -1,
      return_message: "Internal Server Error",
    });
  }
};

exports.verifyPaymentZaloPay = async (app_trans_id) => {
  try {
    const response = await axios.get(
      `${process.env.HOSTNAME}/zalopay/verify-payment?app_trans_id=${app_trans_id}`
    );

    console.log("Trạng thái giao dịch từ ZaloPay:", response.data);

    if (response.data.success) {
      const paymentData = JSON.parse(response.data.data.embed_data);

      try {
        const paymentRecord = await Payment.create({
          user_id: paymentData.user_id,
          show_time_id: paymentData.show_time_id,
          list_seat: paymentData.list_seat,
          total_price: paymentData.total_price,
          discount: paymentData.discount,
          paid_amount: paymentData.paid_amount,
          app_trans_id: parsedData.app_trans_id,
          zp_trans_id: parsedData.zp_trans_id,
          status: "success",
        });
        console.log("Payment saved:", paymentRecord);
      } catch (error) {
        console.error("Error saving payment:", error);
      }

      console.log("Thanh toán thành công và đã lưu vào database.");
    } else {
      console.log("Giao dịch chưa thành công.");
    }
  } catch (error) {
    console.error("Lỗi kiểm tra trạng thái giao dịch:", error.message);
  }
};
