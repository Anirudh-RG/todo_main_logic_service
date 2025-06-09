const todoModel = require('../models/todoModel');
const EMAIL_SERVICE_URL = 'http://localhost:3001'; // Update with your email service URL

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

const checkDate = async(input_date,emailData) =>{
  const date = new Date();
  const currentDate = date.toISOString().split('T')[0]; 
  const inputDate = new Date(input_date);
  const updatedDate = inputDate.toISOString().split('T')[0]; 

  if(currentDate === updatedDate){
    console.log("current date and input date are same, will trigger reminder ")
    try{
      const response = await axios.post(`${EMAIL_SERVICE_URL}/send-email`, {
        to_address : emailData.to_address,
        subject: emailData.subject || 'Todo Reminder',
        text: emailData.text || 'This is a reminder for your todo item.',
        html: emailData.html || '<p>This is a reminder for your todo item.</p>'

      });
      console.log('Reminder sent successfully:', response.data);
      return {success: true, message: 'Reminder sent successfully'};
    }catch(err){
      console.log(err);
      return {success: false, message: 'Failed to send reminder'};
    }
    
  }else{
    console.log("current date and input date are not same, will not trigger reminder")
    return {success: false, message: 'No reminder sent'};
  }
}

const testReminder = async () => {
  const today = new Date().toISOString().split('T')[0];
  
  const emailData = {
    to_address: 'user@example.com',
    subject: 'Daily Reminder',
    text: 'Don\'t forget your important task today!',
    html: '<h2>Daily Reminder</h2><p>Don\'t forget your important task today!</p>'
  };
  
  const result = await checkDate(today, emailData);
  console.log('Result:', result);
};

// testReminder(); // Uncomment to test reminder functionality

exports.addTodo = async (req, res) => {
  // add a function call to check for reminder checking
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
    checkDate(date);
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