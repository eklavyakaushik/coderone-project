const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});


mongoose
  .connect("mongodb://localhost:27017/coderone_feedback")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


const Feedback = mongoose.model("Feedback", {
  name: String,
  contactNumber: String,
  email: String,
  message: String,
});


app.post("/submit-feedback", async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    await newFeedback.save();
    res.send("Feedback submitted successfully!");
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).send("Error submitting feedback");
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
