import User from "../models/User.js";

// Get all users except superadmin
export const getAllPlayers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $ne: "superadmin" },
    }).select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};
