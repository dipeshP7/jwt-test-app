import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/dbconnection.js";
import userRoutes from "./routes/userRoutes.js";
/**
 * dotenv load propeties form .env file to process.env
 */
dotenv.config();

/**
 * Getting PORT, DATATBASE_URL from .env file.
 */
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

/**
 * express provide express module application
 * for server handling
 */
const app = express();
/**
 * cors will use for allowing core policy
 * while connecting fronted to backend
 */
app.use(cors());

/**
 *  connecting to database
 */
connectDB(DATABASE_URL);
/**
 * this will use for returning
 * object type data from api
 */
app.use(express.json());

/**
 * load routes from userRoutes
 * which having all api
 */
app.use("/api/user/", userRoutes);

/**
 * this function initialise express server
 * or run server application on port we specify
 */
app.listen(port, () => {
  console.log(`Server listening at port http://localhost:${port}`);
});
