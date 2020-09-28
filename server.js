//imports
const express = require('express');

//instantiate server
const app = express();

//configure routes
app.get('/', function(req, res) {
    res.setHeader('Content-Type','text/html');
    res.status(200).send('<h1>Welcome on ChoirBook</h1> by <h2>AmahayaS</h2>')
});

//lauch server
app.listen(1812, function(){
    console.log('Server started on port 1812');
})