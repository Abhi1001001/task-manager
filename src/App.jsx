import axios from "axios";
import { useEffect, useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    todo: "",
    completed: false,
    userId: 1,
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [taskCount, setTaskCount] = useState(0);

  const fetchTask = async () => {
    setLoading(true);
    await axios
      .get(`https://dummyjson.com/todos`)
      .then((response) => {
        setTasks(response.data.todos);
        console.log(response.data.todos);
        setLoading(false);
        setTaskCount(response.data.todos.length);
        alert("Note: All operation will not perform it into the server. It will simulate only and will return response");
      })
      .catch((error) => {
        alert(`${error.message} occurred please try again`);
      });
  };

  const updateTask = async (id) => {
    await axios
      .put(`https://jsonplaceholder.typicode.com/users/${id}`, newTask)
      .then((response) => {
        alert("data updated successfully");
        setEditingId(null);
      })
      .catch((error) => {
        alert(`${error.message} occurred please try again`);
      });
  };

  const addTask = async (e) => {
    console.log(newTask);
    e.preventDefault();
    await axios
      .post(`https://dummyjson.com/todos/add`, newTask)
      .then((response) => {
        alert(`data added successfully with ${response.data.id} id`);
        setNewTask({ todo: "", completed: false, userId: 1 });
      })
      .catch((error) => {
        alert(`${error.message} occurred please try again`);
      });
  };

  const deleteTask = async (id) => {
    await axios
      .delete(`https://dummyjson.com/todos/${id}`)
      .then((response) => {
        alert("data deleted successfully");
      })
      .catch((error) => {
        alert(`${error.message} occurred please try again`);
      });
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditedTitle(task.title);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNewTask((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    fetchTask();
  }, []);

  if (loading) {
    return <h1 className="text-2xl text-center mt-20">Loading...</h1>;
  }

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Task Management
          </h2>
          <h2>Total Tasks: {taskCount}</h2>
        </div>
        <form
          className="space-y-2 flex flex-col justify-center items-start"
          onSubmit={addTask}
          action=""
        >
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="todo"
            value={newTask.todo}
            onChange={handleChange}
            placeholder="Enter todo"
          />

          <input
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            name="userId"
            value={newTask.userId}
            onChange={handleChange}
          />
          <div className="flex gap-2">
            <input
              type="checkbox"
              name="completed"
              checked={newTask.completed}
              onChange={handleChange}
            />
            <label>Completed ?</label>
          </div>
          <button
            className="px-3 py-1 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
            type="submit"
          >
            Add
          </button>
        </form>
        <div className="space-y-4">
          {tasks &&
            tasks.map((task) => {
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition"
                >
                  {editingId === task.id ? (
                    <input
                      defaultValue={task.todo}
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-700 font-medium">{task.todo}</p>
                  )}
                  <span
                    className={`inline-block mt-1 text-xs px-2 py-1 rounded-full
                  ${task.completed === true && "bg-green-100 text-green-700"}
                  ${task.completed === false && "bg-yellow-100 text-yellow-700"}
                `}
                  >
                    {task.completed === true ? "Completed" : "Pending"}
                  </span>
                  <div className="flex gap-2 ml-4">
                    {editingId === task.id ? (
                      <button
                        onClick={() => updateTask(task.id)}
                        className="px-3 py-1 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(task)}
                        className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Update
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
