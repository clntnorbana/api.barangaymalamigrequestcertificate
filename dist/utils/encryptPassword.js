"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// hash password
const hashPassword = async (enteredPassword) => {
  const salt = await bcryptjs_1.default.genSalt(10);
  const hashedPassword = await bcryptjs_1.default.hash(enteredPassword, salt);
  return hashedPassword;
};
exports.hashPassword = hashPassword;
// compare password
const comparePassword = (enteredPassword, password) => {
  const isMatch = bcryptjs_1.default.compare(enteredPassword, password);
  return isMatch;
};
exports.comparePassword = comparePassword;
