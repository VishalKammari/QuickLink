const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
mongoose.connect('mongodb://localhost/urlcShortner',{
    useNewUrlParser: true, useUnifiedTopology: true
});
app.set('view engine', 'ejs');
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

