const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const proxy = require('html2canvas-proxy');
const port = 5000;
app.set('views', __dirname + '/demo');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: false}));
app.use('/', proxy());
app.get('/demo', (req, res) => {
    res.render('index.html');
});
app.get('/iframe', (req, res) => {
    res.render('iframe.html');
});
app.get('*', (req, res) => {
    res.json({code: 404});
});
app.listen(port, () => {
    console.log(`server running @ http://localhost:${port}`);
});