import QuizAudit from "../models/QuizAudit";

export const getQuizHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await QuizAudit.find({ user: userId })
      .populate("category", "name")
      .populate("subcategory", "name")
      .sort({ createdAt: -1 });

    const formatted = history.map((h) => ({
      _id: h._id,
      score: h.score,
      totalQuestions: h.totalQuestions,
      category: h.category,
      subcategory: h.subcategory,
      date: h.createdAt,
    }));

    res.json({ history: formatted });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

export const getQuizAuditById = async (req, res) => {
  try {
    const { id } = req.params;

    const audit = await QuizAudit.findById(id)
      .populate("category", "name")
      .populate("quizId", "title");

    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }

    res.json({ audit });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch audit" });
  }
};
