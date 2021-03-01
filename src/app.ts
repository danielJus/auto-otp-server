import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());
const port = 3000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);
const otpCode = "323741";

app.post("/generate-message", (req, res) => {
  const { appHash } = req.body;
  client.messages
    .create({
      body: `<#> ${otpCode} es tu codigo para ingresar a Yappy.${appHash}`,
      from: "+17605613185",
      to: "+50765474230",
    })
    .then(
      (message) => {
        res.status(200).json({
          message: "success",
          sid: message.sid,
        });
      },
      (error) => {
        res.status(500).json({
          message: "error generating message",
          error: error.message,
        });
      }
    );
});

app.post("/validate-otp", (req, res) => {
  const otp = req.body.otp;

  if (otpCode === otp) {
    res.status(200).json({
      message: "success",
    });
  } else {
    res.status(400).json({
      message: "wrong code",
    });
  }
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
