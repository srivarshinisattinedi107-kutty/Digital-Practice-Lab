const Progress = require('../models/Progress');

exports.getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const progressList = await Progress.find({ userId }).sort({ updatedAt: 1 });
    res.json(progressList);
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving progress' });
  }
};

exports.getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.params.userId });
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};