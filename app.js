var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// init app
var app = express();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// setup template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// mongodb connection
const MongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017/todo'
const objectID = require('mongodb').ObjectID;

MongoClient.connect(mongoURL, function(err, database){
    if(err){
        console.log(err);
    } else {
        console.log('MongoDB connected!');
    }
    
    todos = database.collection('todos');
});

// routs
app.get('/', function(req, res){
    todos.find({}).toArray(function(err, docs){
        if(err){
            console.log(err)
        }
        res.render('index', {docs: docs});
    });   
});

app.get('/todos/:id', function(req, res){
    todos.findOne({ _id: objectID(req.params.id) }, function(err, doc){
       if(err){
           console.log(err);
       } 
        res.render('show', {doc: doc});
    }); 
});


app.post('/todos/add', function(req, res){
    todos.insert({title: req.body.title, description: req.body.description}, function(err, result){
        if(err){
            console.log(err);
        } 
        res.redirect('/');
        
    });        
});

app.get('/todos/edit/:id', function(req, res){
        
    res.render('edit');
});

app.post('/todos/update/:id', function(req, res){
        
    res.redirect('/');
});

app.get('/todos/delete/:id', function(req, res){
        
    res.redirect('/');
});

// starting app
app.listen(5000, function(){
    console.log("App is started at http://localhost:5000")
});

