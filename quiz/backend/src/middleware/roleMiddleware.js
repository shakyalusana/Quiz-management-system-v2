const superAdminOnly = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      message: "Access Denied. SuperAdmin Only.",
    });
  }

  next();
};

export default superAdminOnly;
