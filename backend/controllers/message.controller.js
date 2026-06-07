import Message from "../models/Message.js";

export const createMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const message = await Message.create({ ...req.body, senderId });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessagesByProject = async (req, res) => {
  try {
    const messages = await Message.find({
      projectId: req.params.projectId,
    })
      .populate("senderId", "userName email")
      .populate("projectId", "title");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessagesByUser = async (req, res) => {
  try {
    const requestingUserId = req.user.id;
    const messages = await Message.find({
      $or: [{ senderId: requestingUserId }, { receiverId: requestingUserId }],
    })
      .populate("senderId", "userName email")
      .populate("projectId", "title");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
