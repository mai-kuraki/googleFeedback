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
app.all('*', (req, res, next) => {
    //允许跨域
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});
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