import bcypt from "bcryptjs";

// hash password
const hashPassword = async (enteredPassword: string) => {
  const salt = await bcypt.genSalt(10);
  const hashedPassword = await bcypt.hash(enteredPassword, salt);
  return hashedPassword;
};

// compare password
const comparePassword = (enteredPassword: string, password: string) => {
  const isMatch = bcypt.compare(enteredPassword, password);
  return isMatch;
};

export { hashPassword, comparePassword };
