import mongoose from "mongoose";

/**
 * Creating schema to create table
 * in mongo db.
 */
const userSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
});

/**
 * creating Model from schema
 */
const UserModel = mongoose.model("user", userSchema);

export default UserModel;
