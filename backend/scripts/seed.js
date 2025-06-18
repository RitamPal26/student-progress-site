require("dotenv").config();
const fs = require("fs");
const mongoose = require("mongoose");
const Student = require("../models/student");

(async () => {
  await mongoose.connect(process.env.MONGODB_URI); // connect [2]

  const handles = fs.readFileSync("handles.txt", "utf-8").trim().split("\n"); // 40 lines

  const docs = handles.map((h, i) => ({
    name: `CF User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    phone: `90000000${i.toString().padStart(2, "0")}`,
    codeforcesHandle: h, // real handle
  }));

  await Student.insertMany(docs, { ordered: false }); // bulk insert [5]
  console.log("✔ 40 real students inserted");
  mongoose.connection.close();
})();
