//imports
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;

//instantiate server
const app = express();

//Body Parser configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//configure routes
app.get('/', function(req, res) {
    res.setHeader('Content-Type','text/html');
    res.status(200).send('<h1>Welcome on ChoirBook</h1> by <h2>AmahayaS</h2>')
});

app.use('/api/', apiRouter)

//launch server
app.listen(1812, function(){
    console.log('Bravo!! Server started on port 1812');
})