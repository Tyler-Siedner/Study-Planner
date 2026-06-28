import { useState } from "react";
import "./App.css";

type Assignment = {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
};

function App() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: "Math homework",
      course: "Algebra",
      dueDate: "2026-01-15",
      priority: "High",
      completed: false,
    },
    {
      id: 2,
      title: "Read chapter 3",
      course: "English",
      dueDate: "2026-01-18",
      priority: "Medium",
      completed: false,
    },
  ]);

  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");

  function addAssignment(event: React.FormEvent) {
    event.preventDefault();

    if (!title || !course || !dueDate) {
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now(),
      title,
      course,
      dueDate,
      priority,
      completed: false,
    };

    setAssignments([...assignments, newAssignment]);
    setTitle("");
    setCourse("");
    setDueDate("");
    setPriority("Medium");
  }

  function toggleCompleted(id: number) {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === id
          ? { ...assignment, completed: !assignment.completed }
          : assignment
      )
    );
  }

  function deleteAssignment(id: number) {
  setAssignments(assignments.filter((assignment) => assignment.id !== id));
}

const totalAssignments = assignments.length;
const completedAssignments = assignments.filter(
  (assignment) => assignment.completed
).length;
const remainingAssignments = totalAssignments - completedAssignments;

  return (
    <main className="app">
      <section className="hero">
        <h1>Study Planner</h1>
        <p>Track assignments, due dates, priorities, and progress.</p>
      </section>

      <section className="dashboard">
        <div className="card">
          <h2>Add Assignment</h2>

          <form onSubmit={addAssignment} className="assignment-form">
            <input
              type="text"
              placeholder="Assignment title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <input
              type="text"
              placeholder="Course"
              value={course}
              onChange={(event) => setCourse(event.target.value)}
            />

            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as "Low" | "Medium" | "High")
              }
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>

            <button type="submit">Add Assignment</button>
          </form>
        </div>

        <div className="card">
          <h2>Assignments</h2>

          <div className="assignment-list">
            {assignments.map((assignment) => (
              <article
                key={assignment.id}
                className={`assignment ${
                  assignment.completed ? "completed" : ""
                }`}
              >
                <div>
                  <h3>{assignment.title}</h3>
                  <p>{assignment.course}</p>
                  <p>Due: {assignment.dueDate}</p>
                </div>

                <div className="assignment-actions">
                  <span className={`priority ${assignment.priority.toLowerCase()}`}>
                    {assignment.priority}
                  </span>

                  <button onClick={() => toggleCompleted(assignment.id)}>
                    {assignment.completed ? "Undo" : "Done"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;