import { useEffect, useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import toast, { Toaster } from "react-hot-toast"
import Confetti from "react-confetti"
import clickSound from "./assets/click.mp3"
import successSound from "./assets/success.mp3"

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [filter, setFilter] = useState("all")
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)

  const clickAudio = new Audio(clickSound)
  const successAudio = new Audio(successSound)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks")
      setTasks(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const addTask = async () => {
    if (!title) return

    try {
      await axios.post("http://localhost:5000/tasks", {
        title: title
      })

      setTitle("")
      clickAudio.play()
      toast.success("Task Added ✅")
      fetchTasks()
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTask = async (id) => {
  try {
      await axios.delete(`http://localhost:5000/tasks/${id}`)

      clickAudio.play()
      toast.success("Task Deleted 🗑️")
      fetchTasks()
    } catch (error) {
      console.log(error)
    }
  }

  const toggleTask = async (id, completed) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`)

      if (!completed) {
        successAudio.play()
        setShowConfetti(true)

        setTimeout(() => {
          setShowConfetti(false)
        }, 3000)

        toast.success("Task Completed 🎉")
      }

      fetchTasks()
    } catch (error) {
      console.log(error)
    }
  }

  const editTask = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/tasks/edit/${id}`,
        {
          title: editText
        }
      )

      toast.success("Task Updated ✏️")
      setEditingId(null)
      setEditText("")

      fetchTasks()
    } catch (error) {
      console.log(error)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") {
      return task.completed
    }

    if (filter === "pending") {
      return !task.completed
    }

    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <Toaster position="top-right" />
      {showConfetti && <Confetti />}
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0, x: 100 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl bg-slate-900/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-slate-700"
      >
        
        <h1 className="text-5xl font-bold text-center mb-2">
          TaskFlow 🚀
        </h1>

        <p className="text-center text-gray-400 mb-8">
          Manage your daily tasks efficiently
        </p>

        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask()
              }
            }}
            className="flex-1 p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={addTask}
            className="bg-blue-600 px-6 rounded-xl hover:bg-blue-700 transition"
          >
            Add
          </motion.button>
        </div>

        <div className="mb-4 text-gray-400">
          Total Tasks: {tasks.length}
        </div>

        <div className="flex gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl ${
              filter === "all"
                ? "bg-blue-600"
                : "bg-slate-700"
            }`}
          >
            All
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-xl ${
              filter === "completed"
                ? "bg-green-600"
                : "bg-slate-700"
            }`}
          >
            Completed
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-xl ${
              filter === "pending"
                ? "bg-yellow-600"
                : "bg-slate-700"
            }`}
          >
            Pending
          </motion.button>
        </div>

        <AnimatePresence>   
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No tasks yet 😴
              </div>
            ) : (
              filteredTasks.map((task) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-slate-800 p-4 rounded-2xl flex justify-between items-center hover:bg-slate-700 transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {editingId === task._id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 p-2 rounded-lg bg-slate-700 outline-none"
                      />
                    ) : (
                      <span
                        onClick={() => toggleTask(task._id, task.completed)}
                        className={`cursor-pointer text-lg flex-1 ${
                          task.completed
                            ? "line-through text-gray-500"
                            : ""
                        }`}
                      >
                        {task.title}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {editingId === task._id ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => editTask(task._id)}
                        className="bg-green-600 px-4 py-2 rounded-xl"
                      >
                        Save
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setEditingId(task._id)
                          setEditText(task.title)
                        }}
                        className="bg-yellow-600 px-4 py-2 rounded-xl"
                      >
                        Edit
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTask(task._id)}
                      className="bg-red-600 px-4 py-2 rounded-xl"
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </AnimatePresence> 
      </motion.div>
    </div>
  )
}

export default App