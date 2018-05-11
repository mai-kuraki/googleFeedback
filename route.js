const express = require('express');
const router = express.Router();
const http = require('http');
const https = require('https');
router.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});
router.get('/test', (req, res) => {
    res.render('index.html');
});
router.post('/feedbackApi/cors', (req, res) => {
    let args = req.body;
    let url = args.url;
    let handler = (result) => {
        let chunks = [];
        let size = 0;
        result.on('data',(chunk) => {
            chunks.push(chunk);
            size += chunk.length;
        });
        result.on('end',(err) => {
            if(err) {
                res.json({status: 'error'});
            }else{
                let data = Buffer.concat(chunks, size);
                let base64Img = data.toString('base64');
                res.json({code: 200, img: base64Img});
            }
        });
    };
    if(url.indexOf('data:image/png;base64,') == -1 && url) {
        if(url.indexOf('https') > -1) {
            https.get(url, (res2) => {
                handler(res2);
            });
        }else{
            http.get(url, (res2) => {
                handler(res2);
            });
        }
    }else{
        res.json({code: 500});
    }
});
 module.exports = router;