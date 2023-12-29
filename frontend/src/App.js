import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './App.css'; // Add your styles here

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:8080/todos');
      console.log(response.data); // Log the response data
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error.message);
    }
  };

  const addTodo = async () => {
    try {
      if (newTodo.trim() !== '') {
        await axios.post('http://localhost:8080/todos', { title: newTodo });
        fetchTodos();
        setNewTodo('');
      }
    } catch (error) {
      console.error('Error adding todo:', error.message);
    }
  };

  const updateTodo = async (id, updatedTitle, completed) => {
    try {
      await axios.put(`http://localhost:8080/todos/${id}`, { title: updatedTitle, completed });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error.message);
    }
  };

  return (
    <div className="app-container">
      <h1>To-Do App</h1>
      <div className="add-todo-container">
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              onClick={() => updateTodo(todo.id, todo.title, !todo.completed)}
              className={todo.completed ? 'completed' : ''}
            >
              {todo.title}
            </span>{' '}
            <FontAwesomeIcon
              icon={faEdit}
              onClick={() => {
                const updatedTitle = prompt('Edit Todo:', todo.title);
                if (updatedTitle !== null) {
                  updateTodo(todo.id, updatedTitle, todo.completed);
                }
              }}
              className="icon edit-icon"
            />
            <FontAwesomeIcon
              icon={faTrash}
              onClick={() => deleteTodo(todo.id)}
              className="icon delete-icon"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
