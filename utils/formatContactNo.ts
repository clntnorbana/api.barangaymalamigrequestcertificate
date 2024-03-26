const formatContactNo = (contactNo: string) => {
  if (/^\d+$/.test(contactNo)) {
    if (contactNo.startsWith("63")) {
      return `+${contactNo}`;
    } else if (contactNo.startsWith("09")) {
      return `+63${contactNo.slice(1)}`;
    } else {
      return "Invalid input";
    }
  }
};

export default formatContactNo;
