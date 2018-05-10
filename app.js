const express = require('express');
const path = require('path')
const app = express();
const port = 5000;
app.set('views', __dirname + '/test');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/test', (req, res) => {
    res.render('index.html');
});

app.listen(port, () => {
    console.log(`server running @ http://localhost:${port}`);
});