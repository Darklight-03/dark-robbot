var bodyParser = require('body-parser')
var express = require('express')
  , logger = require('morgan')
  , app = express()
  , router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.static(__dirname + '/www'));
app.set('views', (__dirname+'/www'));


app.use("/",router);
router.get('/', (req, res, next)=> {
  res.render('homepage',{title: 'titleee'});
});
router.get('/message',(req, res, next)=>{
  res.render('message', {title: 'titllllle'})
});
router.post('/msg', (req,res)=>{
  var message = req;
  res.render('message',{title: 'sent'});
});
router.get('/restart',(req,res)=>{
  process.exit(0);
});
router.get('*',(req,res)=>{
  res.render('404',{title:'not found'});
});


app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})