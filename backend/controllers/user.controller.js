import User from "../models/User.js";

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const allowedFields = ["userName", "email", "avatar", "skills"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      allowedFields.includes(update),
    );
    if (!isValidOperation) {
      return res.status(400).json({ message: "Invalid updates!" });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { ...req.body },
      { new: true },
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeProfile = async (req, res) => {
  try {
    const { skills, linkedinLink, portFolioLink } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        skills: skills,
        linkedinLink: linkedinLink,
        portFolioLink: portFolioLink,
        isProfileComplete: true,
      },
      { new: true },
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
