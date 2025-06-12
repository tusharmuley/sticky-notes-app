import React, { useEffect, useState } from "react";
import StickyNote from "./components/StickyNote";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("sticky-notes");
    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState("");
  const [showOnlyPinned, setShowOnlyPinned] = useState(false);

  useEffect(() => {
    localStorage.setItem("sticky-notes", JSON.stringify(notes));
  }, [notes]);

  const getRandomColor = () => {
    const colors = ["#fff475", "#f28b82", "#ccff90", "#a7ffeb", "#d7aefb", "#fdcfe8", "#aecbfa"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const addNote = () => {
    const now = new Date().toISOString();
    const newNote = {
      id: Date.now(),
      x: 100,
      y: 100,
      width: 230,
      height: 150,
      text: "New note",
      color: getRandomColor(),
      createdAt: now,
      updatedAt: now,
      pinned: false,
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const updateNote = (id, updates) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
      )
    );
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const togglePin = (id) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note))
    );
  };

  const filteredNotes = notes
    .filter((note) => note.text.toLowerCase().includes(search.toLowerCase()))
    .filter((note) => (showOnlyPinned ? note.pinned : true))
    .sort((a, b) => b.pinned - a.pinned); // pinned notes first

  return (
    <div>
      <header className="app-header">
        <div className="header-bar">
          <div className="logo-title">
            <span className="logo">🗒️</span>
            <h1>Sticky Notes</h1>
          </div>

          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <button className="primary-btn" onClick={addNote}>
            ➕ Add Note
          </button>

          <button
            className={`secondary-btn ${showOnlyPinned ? "pinned" : ""}`}
            onClick={() => setShowOnlyPinned(!showOnlyPinned)}
          >
            {showOnlyPinned ? "📌 Showing Pinned" : "📍 Show Only Pinned"}
          </button>
        </div>
      </header>

      <div className="board">
        {filteredNotes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onDelete={deleteNote}
            onTogglePin={togglePin}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
