import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { testConnection } from "./config/database";

import residentRoute from "./routes/resident";
import employeeRoute from "./routes/employee";
import certificateRoute from "./routes/certificate";
import recordRoute from "./routes/record";

const app = express();

const corsOption = {
  origin: "frontendcapstone-production.up.railway.app",
  credentials: true,
};

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOption));

const port = process.env.PORT || 3000;

// test connection
testConnection();

// run server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// routes
app.use("/api/resident", residentRoute);
app.use("/api/employee", employeeRoute);
app.use("/api/certificate", certificateRoute);
app.use("/api/record", recordRoute);
