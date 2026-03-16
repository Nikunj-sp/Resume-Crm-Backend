import express from "express";
import Resume from "../models/resume";
import bcrypt from "bcryptjs";
import Admin from "../models/admin";
import { protect } from "../middleware/auth.middleware";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"));
    }
  },
});

router.get("/check-admin", async (req, res) => {
  const admins = await Admin.find();
  res.json(admins);
});

router.get("/reset-admin", async (req, res) => {
  await Admin.deleteMany({});
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await Admin.create({
    email: "admin@gmail.com",
    password: hashedPassword,
  });
  res.json(admin);
});


router.get("/create-admin", async (req, res)=>{
  const hashedPassword = await bcrypt.hash("akop0", 10);

  const admin = await Admin.create({
    email: "akop@gmail.com",
    password: hashedPassword,
  });

  res.json(admin);
})

// Test route
router.get("/test", (req, res) => {
  res.send("Resume route working");
});

// CREATE
router.post("/", protect, upload.single("resumeFile"), async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "No form data received" });
    }

    const {
      fullName,
      email,
      phone,
      category,
      skills,
      experience,
      currentCompany,
      expectedSalary,
      location,
      notes,
    } = req.body;

    const resume = await Resume.create({
      fullName,
      email,
      phone,
      category,
      skills: skills ? skills.split(",") : [],
      experience,
      currentCompany,
      expectedSalary,
      location,
      notes,
      resumeFile: req.file ? req.file.path.replace(/\\/g, "/") : null,
    });
    res.status(201).json(resume);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

// GET ALL
router.get("/", protect, async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
      res.json(resumes);
  } catch (error) {
      res.status(500).json({message: "Error Fetching resumes"})
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});


export default router;
