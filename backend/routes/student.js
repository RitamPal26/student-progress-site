const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const { syncStudentData } = require("../services/codeforcesService");

/* ---------- GET all students ---------- */
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------- CREATE new student ---------- */
router.post("/", async (req, res) => {
  try {
    const student = new Student(req.body);
    const saved = await student.save();

    // live Codeforces sync right after creation
    await syncStudentData(saved);

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ---------- UPDATE student ---------- */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // re-sync if the handle changed or just to refresh ratings
    await syncStudentData(updated);

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ---------- DELETE student ---------- */
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------- MANUAL SYNC endpoint ---------- */
router.post("/:id/sync", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "not found" });

    const refreshed = await syncStudentData(student);
    res.json(refreshed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
