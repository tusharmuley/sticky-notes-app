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
      pinned: false
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const updateNote = (id, updates) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const togglePin = (id) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  const filteredNotes = notes
    .filter((note) =>
      note.text.toLowerCase().includes(search.toLowerCase())
    )
    .filter((note) => (showOnlyPinned ? note.pinned : true)) // 👈 Only pinned if toggled
    .sort((a, b) => {
      if (a.pinned === b.pinned) return 0;
      return a.pinned ? -1 : 1; // 📌 pinned notes first
    });



  const sortedNotes = [...filteredNotes].sort((a, b) => b.pinned - a.pinned);

  return (
    <div>
      <div style={{ margin: '10px', display: 'flex', gap: '10px' }}>
        <button
          onClick={addNote}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            transition: 'background 0.2s ease, transform 0.1s ease',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          ➕ Add Note
        </button>

        <button
          onClick={() => setShowOnlyPinned(!showOnlyPinned)}
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '16px',
            backgroundColor: showOnlyPinned ? '#ff9800' : '#607d8b',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}
        >
          {showOnlyPinned ? '📌 Showing Pinned' : '📍 Show Only Pinned'}
        </button>

        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '8px 12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            flex: '1',
          }}
        />

        <header className="app-header">
          <div className="logo-title">
            <span className="logo">🗒️</span>
            <h1>Sticky Notes</h1>
          </div>
        </header>
      </div>
      

      <div className="board">
        {sortedNotes.map((note) => (
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
