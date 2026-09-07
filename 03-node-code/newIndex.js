const express = require('express');

const app = express();

app.use(express.json());

app.get('/menu', (req, res) => {
    return res.json({items: ['Pizza', 'Burger', 'Salad']});
})

app.post('/order', (req, res) => {
    res.status(200).json({message: 'order received', order: req.body});
})