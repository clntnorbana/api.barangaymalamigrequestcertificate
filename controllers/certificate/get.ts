import { Request, Response } from "express";
import {
  retrieveAllRequestCertificate,
  retrieveRequestCertificateById,
} from "./template/retrieveRequestCertificateQuery";

// get all
const getRequestCertificates = async (req: Request, res: Response) => {
  try {
    const requests = await retrieveAllRequestCertificate();
    res.status(200).json(requests);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// get single
const getRequestCertificate = async (req: Request, res: Response) => {
  try {
    const transaction_id: string = req.params.transaction_id;
    const request = await retrieveRequestCertificateById(transaction_id);

    res.status(200).json(request);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export { getRequestCertificates, getRequestCertificate };
