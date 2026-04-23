const Grievance = require("../models/Grievance");

// CREATE
exports.createGrievance = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const grievance = await Grievance.create({
      title,
      description,
      category,
      user: req.user.id,
    });

    res.json(grievance);
  } catch (err) {
    res.status(500).json({ msg: "Error creating grievance" });
  }
};

// GET ALL (only user's grievances)
exports.getGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ user: req.user.id });
    res.json(grievances);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching grievances" });
  }
};

// GET BY ID
exports.getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) return res.status(404).json({ msg: "Not found" });

    res.json(grievance);
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

// UPDATE
exports.updateGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) return res.status(404).json({ msg: "Not found" });

    if (grievance.user.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    const updated = await Grievance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch {
    res.status(500).json({ msg: "Error updating" });
  }
};

// DELETE
exports.deleteGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) return res.status(404).json({ msg: "Not found" });

    if (grievance.user.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    await grievance.deleteOne();

    res.json({ msg: "Deleted" });
  } catch {
    res.status(500).json({ msg: "Error deleting" });
  }
};

// SEARCH
exports.searchGrievances = async (req, res) => {
  try {
    const { title } = req.query;

    const grievances = await Grievance.find({
      user: req.user.id,
      title: { $regex: title, $options: "i" },
    });

    res.json(grievances);
  } catch {
    res.status(500).json({ msg: "Search error" });
  }
};