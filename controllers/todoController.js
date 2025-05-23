const todoModel = require('../models/todoModel');

exports.getTodos = async (req, res) => {
  try {
    const userTodos = await todoModel.getTodosByUser(req.user.username);
    res.json(userTodos);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCompletedTodos = async (req,res) => {
  try {
    console.log(req.user.username)
    const userTodos = await todoModel.getCompletedTodosByUser(req.user.username);

    res.json(userTodos);
  } catch (err) {
    console.error('Error fetching completed todos:', err);
    res.status(500).json({ message: 'error while retreiving completed totods' });
  }
}

exports.addTodo = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const newTodo = await todoModel.addTodo(
      req.user.username,
      title,
      description || '',
      date || null
    );
    
    res.status(201).json(newTodo);
  } catch (err) {
    console.error('Error adding todo:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    // console.log(req.body.completed);
    const { id } = req.params;
    const updates = { ...req.body };
    console.log(updates);
    const updatedTodo = await todoModel.updateTodo(
      id,
      req.user.username,
      updates
    );
    
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json(updatedTodo);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    
    await todoModel.deleteTodo(id, req.user.username);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ message: 'Server error' });
  }
};