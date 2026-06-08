import Project from "../models/Project.js";
import Application from "../models/Application.js";
import Message from "../models/Message.js";
import { escapeRegex } from "../utils/escapeRegex.js";

export const createProject = async (req, res) => {
  try {
    const { title, description, domain, requiredSkills, status } = req.body;
    const project = await Project.create({
      title,
      description,
      domain,
      requiredSkills,
      status,
      owner: req.user.id,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (req.user.id !== project.owner.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Project.findByIdAndDelete(req.params.projectId);
    await Application.deleteMany({ projectId: req.params.projectId });
    await Message.deleteMany({ projectId: req.params.projectId });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Project.countDocuments();
    const projects = await Project.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      projects,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProjects: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { title, description, domain, requiredSkills, status } = req.body;
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      { title, description, domain, requiredSkills, status },
      { new: true },
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchProjects = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const safe = escapeRegex(query.trim());
    const projects = await Project.find({
      $or: [
        { title: { $regex: safe, $options: "i" } },
        { description: { $regex: safe, $options: "i" } },
        { requiredSkills: { $regex: safe, $options: "i" } },
        { domain: { $regex: safe, $options: "i" } },
      ],
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectsByOwner = async (req, res) => {
  try {
    const owner = req.user.id;
    const projects = await Project.find({ owner });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
