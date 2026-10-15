require("dotenv").config();

const connectDB = require("./src/config/db");
const User = require("./src/models/User");

const resetAdmin = async () => {
  try {
    await connectDB();

    const admin = await User.findOne({
      email: "admin@email.com",
    }).select("+password");

    if (!admin) {
      console.log("Admin user not found.");
      process.exit(1);
    }

    admin.password = "admin123456";

    await admin.save();

    console.log("Admin password reset successfully.");
    console.log("Email:", admin.email);
    console.log("New password: admin123456");

    process.exit(0);
  } catch (error) {
    console.error("Reset failed:", error);
    process.exit(1);
  }
};

resetAdmin();
