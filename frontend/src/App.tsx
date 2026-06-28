import { useEffect, useState, type FormEvent } from "react";
import "./App.css";

type Assignment = {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
};

type FilterOption = "All" | "Active" | "Completed";
type SortOption = "Due Date" | "Priority";

function App() {
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const savedAssignments = localStorage.getItem("assignments");

    if (savedAssignments) {
      try {
        return JSON.parse(savedAssignments) as Assignment[];
      } catch {
        return [];
      }
    }

    return [
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
    ];
  });

  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [filter, setFilter] = useState<FilterOption>("All");
  const [sortOption, setSortOption] = useState<SortOption>("Due Date");
  const [editingAssignmentId, setEditingAssignmentId] = useState<number | null>(
    null
  );

  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  function addAssignment(event: FormEvent) {
    event.preventDefault();

    if (!title || !course || !dueDate) {
      return;
    }

    if (editingAssignmentId !== null) {
      setAssignments(
        assignments.map((assignment) =>
          assignment.id === editingAssignmentId
            ? {
                ...assignment,
                title,
                course,
                dueDate,
                priority,
              }
            : assignment
        )
      );

      setEditingAssignmentId(null);
    } else {
      const newAssignment: Assignment = {
        id: Date.now(),
        title,
        course,
        dueDate,
        priority,
        completed: false,
      };

      setAssignments([...assignments, newAssignment]);
    }

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

  function startEditingAssignment(assignment: Assignment) {
    setEditingAssignmentId(assignment.id);
    setTitle(assignment.title);
    setCourse(assignment.course);
    setDueDate(assignment.dueDate);
    setPriority(assignment.priority);
  }

  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(
    (assignment) => assignment.completed
  ).length;
  const remainingAssignments = totalAssignments - completedAssignments;

  const priorityOrder = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === "Active") {
      return !assignment.completed;
    }

    if (filter === "Completed") {
      return assignment.completed;
    }

    return true;
  });

  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (sortOption === "Priority") {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <main className="app">
      <section className="hero">
        <h1>Study Planner</h1>
        <p>Track assignments, due dates, priorities, and progress.</p>
      </section>

      <section className="stats">
        <div className="stat-card">
          <span>Total</span>
          <strong>{totalAssignments}</strong>
        </div>

        <div className="stat-card">
          <span>Completed</span>
          <strong>{completedAssignments}</strong>
        </div>

        <div className="stat-card">
          <span>Remaining</span>
          <strong>{remainingAssignments}</strong>
        </div>
      </section>

      <section className="dashboard">
        <div className="card">
          <h2>
            {editingAssignmentId === null
              ? "Add Assignment"
              : "Edit Assignment"}
          </h2>

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

            <button type="submit">
              {editingAssignmentId === null ? "Add Assignment" : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="card">
          <div className="assignment-header">
            <h2>Assignments</h2>

            <div className="controls">
              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as FilterOption)
                }
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value as SortOption)
                }
              >
                <option value="Due Date">Sort by Due Date</option>
                <option value="Priority">Sort by Priority</option>
              </select>
            </div>
          </div>

          <div className="assignment-list">
            {sortedAssignments.length === 0 ? (
              <p className="empty-message">No assignments match this filter.</p>
            ) : (
              sortedAssignments.map((assignment) => (
                <article
                  key={assignment.id}
                  className={`assignment ${
                    assignment.completed ? "completed" : ""
                  }`}
                >
                  <div>
                    <h3>{assignment.title}</h3>

                    {editingAssignmentId === assignment.id && (
                      <p className="editing-message">Editing this assignment</p>
                    )}

                    <p>{assignment.course}</p>
                    <p>Due: {assignment.dueDate}</p>
                  </div>

                  <div className="assignment-actions">
                    <span
                      className={`priority ${assignment.priority.toLowerCase()}`}
                    >
                      {assignment.priority}
                    </span>

                    <button onClick={() => toggleCompleted(assignment.id)}>
                      {assignment.completed ? "Undo" : "Done"}
                    </button>

                    <button onClick={() => startEditingAssignment(assignment)}>
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => deleteAssignment(assignment.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
