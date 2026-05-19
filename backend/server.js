const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

const Task = require("./models/Task")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log(err))

app.get("/", (req, res) => {
  res.send("Backend Running 🚀")
})

app.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title
    })

    await newTask.save()

    res.status(201).json(newTask)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find()

    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id)

    res.json({ message: "Task deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    task.completed = !task.completed

    await task.save()

    res.json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.put("/tasks/edit/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title
      },
      { new: true }
    )

    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})