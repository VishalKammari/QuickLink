const express = require('express');
const path = require("path");
const favicon = require("serve-favicon");

const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "favicon.png")));

mongoose.connect('mongodb+srv://vishal:vishal2102@cluster0.7dw8zod.mongodb.net/shortly?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:false}));

app.get('/', async(req, res) => {
  const shortUrls=await ShortUrl.find()
  res.render('index', {shortUrls:shortUrls});
});

app.post('/shortUrls', async(req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
});

app.get('/:shortUrl',async(req,res)=>{
    const shortUrl=await ShortUrl.findOne({short: req.params.shortUrl})
    if(shortUrl == null){
        return res.sendStatus(404)
    }
    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

