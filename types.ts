type TResident = {
  id?: string;
  profile_id?: string;
  img_url?: string;
  firstname: string;
  lastname: string;
  middlename: string;
  sex: "male" | "female";
  date_of_birth: string;
  place_of_birth: string;
  contact_no: string;
  email: string;
  citizenship: string;
  religion: string;
  civil_status: "single" | "married" | "widow/er" | "single parent";
  company: string;
  occupation: string;
  number_street: string;
  barangay?: string;
  city?: string;
  zip_code?: string;
  voter: 0 | 1;
  updated_at?: string;
  created_at?: string;
};

type TEmployee = {
  id: string;
  employee_id: string;
  admin_role: "normal" | "editor" | null;
  img_url: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  middlename: string;
  email: string;
  contact_no: string;
  status: string;
  created_at?: string;
};

type TRequestCertificate = {
  id: string;
  transaction_id: string;
  profile_id: string;
  request_by: string;
  certificate_type: "indigency" | "barangay clearance";
  purpose: string;
  contact_no: string;
  email: string;
  status: "rejected" | "approved" | "pending";
  request_date: string;
  images?: string[];
};

type TRecord = {
  id: string;
  transaction_id: string;
  certificate_type: "indigency" | "barangay clearance";
  profile_id: string;
  resident_name: string;
  resident_contact_no: string;
  request_date: string;
  committed_date: string;
  committed_by: string;
};

type TImages = {
  id: string;
  transaction_id: string;
  img_url: string;
};

export { TResident, TEmployee, TRequestCertificate, TImages, TRecord };
