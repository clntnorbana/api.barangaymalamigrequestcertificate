namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    MYSQLHOST: string;
    MYSQLUSER: string;
    MYSQLPASSWORD: string;
    MYSQLDATABASE: string;
    MYSQLPORT: number;
    JWT_SECRET: string;
    CLOUDINARY_CLOUDNAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    TWILIO_ACCOUNT_SID: string;
    TWILIO_ACCOUNT_TOKEN: string;
    TWILIO_PHONE_NUMBER: string;
  }
}

namespace Express {
  interface Request {
    userData: any;
  }
}
