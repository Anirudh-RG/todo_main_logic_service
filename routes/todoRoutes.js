const express = require('express');
const { getTodos, addTodo, updateTodo, deleteTodo, getCompletedTodos } = require('../controllers/todoController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(verifyToken); // all routes below are protected

router.get('/', getTodos);
router.get('/health',(req,res)=>{
    res.status(200).json({message:"Todo Service is up and running"});
})
router.get('/completed',getCompletedTodos);
router.post('/', addTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
