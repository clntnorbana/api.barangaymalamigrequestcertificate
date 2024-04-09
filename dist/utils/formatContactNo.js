"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatContactNo = (contactNo) => {
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
exports.default = formatContactNo;
