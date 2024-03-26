import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_TOKEN;

const client = twilio(accountSid, authToken);

const sendSMS = async (message: string, contact_no: string) => {
  let messageOption = {
    from: process.env.TWILIO_PHONE_NUMBER,
    to: contact_no,
    body: message,
  };

  try {
    await client.messages.create(messageOption);
  } catch (error: any) {
    console.log(error.message);
  }
};

export default sendSMS;
