import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add a new todo
  const addTodo = () => {
    if (title.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTodos([...todos, newTodo]);
      setTitle('');
      setDescription('');
    }
  };

  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Toggle completion status
  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Start editing a todo
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  // Save edited todo
  const saveEdit = () => {
    if (editTitle.trim() !== '') {
      setTodos(todos.map(todo => 
        todo.id === editingId ? { 
          ...todo, 
          title: editTitle.trim(),
          description: editDescription.trim()
        } : todo
      ));
      setEditingId(null);
      setEditTitle('');
      setEditDescription('');
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  // Filter todos based on active tab
  const filteredTodos = todos.filter(todo => {
    // First filter by tab
    if (activeTab === 'active') return !todo.completed;
    if (activeTab === 'completed') return todo.completed;
    return true; // 'all' tab
  }).filter(todo => {
    // Then filter by search term
    const searchLower = searchTerm.toLowerCase();
    const titleLower = todo.title.toLowerCase();
    const descriptionLower = (todo.description || '').toLowerCase(); // Handle undefined description
    
    return titleLower.includes(searchLower) || descriptionLower.includes(searchLower);
  });

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <Head>
        <title>Enhanced To-Do App</title>
      </Head>

      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>Enhanced To-Do App</h1>

      {/* Add Todo Section */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h3 style={{ marginTop: 0, color: '#333' }}>Add New Todo</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Todo title..."
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '10px'
            }}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Todo description (optional)..."
            rows="3"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical',
              fontFamily: 'Arial, sans-serif'
            }}
          />
        </div>
        
        <button
          onClick={addTodo}
          disabled={!title.trim()}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: title.trim() ? '#4CAF50' : '#cccccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: title.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          Add Todo
        </button>
      </div>

      {/* Search and Tabs Section */}
      <div style={{ marginBottom: '20px' }}>
        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search todos by title or description..."
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '15px'
          }}
        />

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
          {['all', 'active', 'completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: activeTab === tab ? '#f0f0f0' : 'white',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #4CAF50' : 'none',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontWeight: activeTab === tab ? 'bold' : 'normal'
              }}
            >
              {tab === 'all' ? 'All' : tab === 'active' ? 'To Do' : 'Completed'} 
              {tab === 'all' && ` (${todos.length})`}
              {tab === 'active' && ` (${todos.filter(t => !t.completed).length})`}
              {tab === 'completed' && ` (${todos.filter(t => t.completed).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Todo List */}
      <div>
        {filteredTodos.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#777', 
            padding: '40px',
            border: '1px dashed #ddd',
            borderRadius: '8px'
          }}>
            {searchTerm ? 'No todos match your search' : 
             activeTab === 'all' ? 'No todos yet. Add one above!' :
             activeTab === 'active' ? 'No active todos. Great job!' : 'No completed todos yet.'}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div
              key={todo.id}
              style={{
                padding: '15px',
                border: '1px solid #eee',
                borderRadius: '8px',
                marginBottom: '12px',
                backgroundColor: todo.completed ? '#f0f8f0' : 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {editingId === todo.id ? (
                /* Edit Mode */
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '16px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      marginBottom: '8px',
                      fontWeight: 'bold'
                    }}
                    autoFocus
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '14px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      resize: 'vertical',
                      marginBottom: '10px',
                      fontFamily: 'Arial, sans-serif'
                    }}
                    placeholder="Add description (optional)..."
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={saveEdit}
                      disabled={!editTitle.trim()}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: editTitle.trim() ? '#4CAF50' : '#cccccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: editTitle.trim() ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    style={{ marginTop: '3px' }}
                  />

                  {/* Todo Content */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '16px',
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? '#666' : '#333',
                        marginBottom: '5px'
                      }}
                    >
                      {todo.title}
                    </div>
                    {todo.description && (
                      <div
                        style={{
                          fontSize: '14px',
                          color: todo.completed ? '#888' : '#666',
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          lineHeight: '1.4'
                        }}
                      >
                        {todo.description}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!todo.completed && (
                      <button
                        onClick={() => startEdit(todo)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}