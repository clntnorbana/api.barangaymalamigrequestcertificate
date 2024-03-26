import { RowDataPacket } from "mysql2";
import { pool } from "../../../config/database";
import { getImagePathName } from "../../../config/cloudinary";
import { TResident } from "../../../types";

// retrieve all residents
const retrieveAllResidents = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM residents`);

  if (rows && rows.length > 0) {
    const residents: TResident[] = rows.map((row) => {
      return row as TResident;
    });

    return residents;
  } else {
    return [];
  }
};

// retrieve resident by id
const retrieveResidentById = async (profileId: string) => {
  const [row] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM residents WHERE profile_id = ?`,
    [profileId]
  );

  if (row && row.length > 0) {
    const resident = row[0] as TResident;
    await getImagePathName(row, resident.img_url);

    return row;
  } else {
    return null;
  }
};

export { retrieveAllResidents, retrieveResidentById };
