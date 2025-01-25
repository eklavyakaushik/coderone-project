const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const Feedback = require("./models/Feedback");

const app = express();
const PORT = process.env.PORT || 3000;

const MONGODB_URI = "mongodb://localhost:27017/coderone_feedback";
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/submit-feedback", async (req, res) => {
  try {
    console.log("Received feedback submission:", req.body);

    const { name, contactNumber, email, message } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send(`
        <script>
          alert('Invalid email format. Please enter a valid email address.');
          window.location.href = '/';
        </script>
      `);
    }

    const newFeedback = new Feedback({
      name: name.trim(),
      contactNumber: contactNumber.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    const savedFeedback = await newFeedback.save();

    res.send(`
      <script>
        alert('Feedback submitted successfully! Thank you for your input.');
        window.location.href = '/';
      </script>
    `);

    console.log("Feedback saved successfully:", savedFeedback._id);
  } catch (error) {
    console.error("Error submitting feedback:", error);

    res.status(500).send(`
      <script>
        alert('Error submitting feedback. Please check your information and try again.');
        window.location.href = '/';
      </script>
    `);
  }
});

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
