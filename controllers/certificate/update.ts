import { Request, Response } from "express";
import { TEmployee, TRequestCertificate } from "../../types";
import { retriveEmployeeById } from "../employee/template/retrieveEmployeeQuery";
import { pool } from "../../config/database";
import { retrieveRequestCertificateById } from "./template/retrieveRequestCertificateQuery";
import sendSMS from "../../config/twilio";
import formatContactNo from "../../utils/formatContactNo";

// approve request
const approveRequest = async (req: Request, res: Response) => {
  try {
    const transaction_id: string = req.params.transaction_id;

    const { employee_id }: TEmployee = req.body;

    const employee = await retriveEmployeeById(employee_id);

    // set employee
    let commitedBy: string = "";
    if (employee) {
      const employeeInfo = employee[0] as TEmployee;
      commitedBy = `${employeeInfo.firstname} ${employeeInfo.lastname}`;
    }

    //  update status
    const newStatus = "approved";

    await pool.query(
      `UPDATE request_certificate SET status = ? WHERE transaction_id = ?`,
      [newStatus, transaction_id]
    );

    // fetch request data to be save in records table
    const request = await retrieveRequestCertificateById(transaction_id);
    if (request) {
      const requestInfo = request[0] as TRequestCertificate;

      await addToRecord(
        requestInfo.transaction_id,
        requestInfo.certificate_type,
        requestInfo.profile_id,
        requestInfo.request_by,
        requestInfo.contact_no,
        commitedBy,
        requestInfo.request_date
      );

      // format contact
      const formattedContactNo: any = formatContactNo(requestInfo.contact_no);
      // send sms
      sendSMS(
        `Your request for obtaining certificate of ${requestInfo.certificate_type} has been approved, please download and print the profiling form from the website, and proceed to the barangay to retrieve the document`,
        formattedContactNo
      );
    }

    res.status(200).json({ message: "request approved" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// reject request
const rejectRequest = async (req: Request, res: Response) => {
  try {
    const transaction_id: string = req.params.transaction_id;
    const remark: string = req.body.remark;

    // update status
    const newStatus = "rejected";

    await pool.query(
      `UPDATE request_certificate SET status = ? WHERE transaction_id = ?`,
      [newStatus, transaction_id]
    );

    // fetch request data to be save in records table
    const request = await retrieveRequestCertificateById(transaction_id);
    if (request) {
      const requestInfo = request[0] as TRequestCertificate;

      // format contact
      const formattedContactNo: any = formatContactNo(requestInfo.contact_no);
      // message
      const defaultMsg = `Your request for obtaining certificate of ${requestInfo.certificate_type} has been rejected, please download and print the profiling form from the website, and proceed to the barangay to retrieve the document`;

      // send sms
      sendSMS(remark !== "" ? remark : defaultMsg, formattedContactNo);
    }

    res.status(200).json({ message: "request rejected" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// undo reject
const undoReject = async (req: Request, res: Response) => {
  try {
    const transaction_id: string = req.params.transaction_id;

    // set status
    const newStatus = "pending";

    await pool.query(
      `UPDATE request_certificate SET status = ? WHERE transaction_id = ?`,
      [newStatus, transaction_id]
    );

    res.status(200).json({ message: "undone" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// update purpose
const updatePurpose = async (req: Request, res: Response) => {
  try {
    const newPurpose: string = req.body.newPurpose;
    const transaction_id: string = req.params.transaction_id;

    // check input
    if (!newPurpose || newPurpose === "") {
      return res.status(400).json({ message: "Field is required" });
    }

    const request = await retrieveRequestCertificateById(transaction_id);
    if (request) {
      const requestInfo = request[0] as TRequestCertificate;

      if (newPurpose === requestInfo.purpose) {
        return res.status(400).json({
          message: "New purpose cannot be the same as the current one.",
        });
      }
    }

    // update purpose query
    await pool.query(
      `UPDATE request_certificate SET purpose = ? WHERE transaction_id = ?`,
      [newPurpose, transaction_id]
    );

    res.status(200).json({ message: "Purpose updated" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// add approve request to record table
const addToRecord = async (
  transaction_id: string,
  certificate_type: string,
  profile_id: string,
  request_by: string,
  contact_no: string,
  committed_by: string,
  request_date: string
) => {
  await pool.query(
    `INSERT INTO request_certificate_record (transaction_id, certificate_type, profile_id, resident_name, resident_contact_no, committed_by, request_date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      transaction_id,
      certificate_type,
      profile_id,
      request_by,
      contact_no,
      committed_by,
      request_date,
    ]
  );
};

export { approveRequest, rejectRequest, undoReject, updatePurpose };
