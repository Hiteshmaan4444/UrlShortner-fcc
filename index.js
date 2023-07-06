require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const verifyUrl=(req,res,next)=>{
    const url = req.body.url;
      if(!url.includes("https://")&&!url.includes("http://")){
        res.json({ error: 'invalid url' });
      }else{
        next();
      }
}
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urls =[]

app.post("/api/shorturl",verifyUrl,(req,res)=>{
    const url =req.body.url;
    const idx = urls.indexOf(url);
    if(idx<0){
      urls.push(url);
      return res.json({
        original_url: url,
        short_url:urls.indexOf(url)
      })
    }

    return res.json({
      original_url: url,
      short_url:urls.indexOf(url)
    })

})

app.get("/api/shorturl/:url",(req,res)=>{
  const url=parseInt(req.params.url);
  if(url>=urls.length){
    res.json({ error: 'invalid url' });
  }else{
    res.redirect(urls[url]);
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
