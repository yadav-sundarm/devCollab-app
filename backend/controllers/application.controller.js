import Application from "../models/Application.js";
import Project from "../models/Project.js";

export const createApplication = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const applicantId = req.user.id;
    const applicationData = await Application.findOne({
      projectId,
      applicantId,
    });

    if (applicationData) {
      return res
        .status(400)
        .json({ message: "You have already applied for this project." });
    }
    const application = await Application.create({
      ...req.body,
      projectId,
      applicantId,
    });
    await Project.findByIdAndUpdate(projectId, {
      $push: { applications: application._id },
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationsByProject = async (req, res) => {
  try {
    const applications = await Application.find({
      projectId: req.params.projectId,
    }).populate(
      "applicantId",
      "userName skills email githubLink portFolioLink ",
    );
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const allowedStatuses = ["Accepted", "Rejected", "Pending"];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { status: req.body.status },
      { new: true },
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicantId: req.user.id,
    })
      .populate("projectId", "title domain status")
      .populate("applicantId", "userName email");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
