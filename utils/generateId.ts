// generate random string
const random = (len: number) => {
  let result = "";
  const chars = "QWERTYUIOPASDFGHJKLZXCVBNM0123456789";

  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

// generate id
const generateId = (pfx: string) => {
  const currentYr = new Date().getFullYear();
  const randomStr = random(7);
  const id = `${pfx}${randomStr}${currentYr}`;

  return id;
};

export default generateId;
