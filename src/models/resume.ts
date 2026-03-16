import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    skills: {
      type: [String],
      required: true,
    },

    category: {
      type: String,
      enum: ["Digital Marketing", "Cyber Security", "Full Stack Development"],
      required: true,
    },

    experience: { type: Number },
    currentCompany: { type: String },
    expectedSalary: { type: Number },
    location: { type: String },
    resumeFile: { type: String },
    notes: { type: String },

    status: {
      type: String,
      enum: ["New", "Shortlisted", "Rejected", "Called"],
      default: "New",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", ResumeSchema);
