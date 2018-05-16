const express = require('express');
const path = require('path');
const app = express();
const route = require('./route');
const bodyParser = require('body-parser');
const port = 5000;
app.set('views', __dirname + '/demo');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: false}));
app.use(`/`, route);
app.listen(port, () => {
    console.log(`server running @ http://localhost:${port}`);
});