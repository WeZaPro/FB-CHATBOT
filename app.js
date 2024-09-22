const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
require("dotenv").config();

// ตรงนี้จะเป็น endpoint สำหรับ webhook
// app.post("/webhook", (req, res) => {
//   const messagingEvents = req.body.entry[0].messaging;

//   messagingEvents.forEach((event) => {
//     const senderId = event.sender.id;

//     if (event.message && event.message.text) {
//       // ตอบกลับผู้ใช้
//       sendMessage(senderId, `คุณส่งข้อความ: ${event.message.text}`);
//     }
//   });

//   res.sendStatus(200);
// });
app.get("/webhook", (req, res) => {
  console.log("req.body ", req.body);
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("mode", mode);
  console.log("token ", token);
  console.log("challenge ", challenge);

  // const messagingEvents = req.body.entry[0].messaging;
  // console.log("messagingEvents ", messagingEvents);

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified!");
      res.status(200).send(challenge); // ส่ง challenge กลับไป
    } else {
      res.sendStatus(403); // ส่ง 403 Forbidden หากโทเค็นไม่ถูกต้อง
    }
  }
});

app.get("/", (req, res) => {
  res.send("welcome api");
});

function sendMessage(senderId, messageText) {
  // ฟังก์ชันสำหรับส่งข้อความกลับไปยังผู้ใช้ (จะต้องใช้ Facebook Graph API)
  console.log(`ส่งข้อความไปยัง ${senderId}: ${messageText}`);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
