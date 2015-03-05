//getting started with express, bodyParser 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//db
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todotest');
//each schema maps to a MongoDB collection and defines the shape of the documents within that collection
var Schema = mongoose.Schema;

//blueprint for data, defining your schema
var todoSchema = new Schema ({
  title: String,
  description: String,
  is_done: Boolean,
  created_at: Date
}); 

//architect; point of access
//model is a class that constructs documents
var ToDo = mongoose.model("Todo", todoSchema);

//middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.set('view engine', 'jade');


//routes
//get list.jade page
app.get('/', function (req, res){
  //find all Todo data in collection
  ToDo.find(function(err, todosFromDB){
    // console.log(todosFromDB);
    res.render('list', {
      todos : todosFromDB
    });    
  });
});

// get newtodo list.jade page
app.get('/new_todo', function (req, res){
  res.render('new_todo');
});


// get edit todo form page
app.get('/todos/:id', function (req, res){
  var todo_id = req.params.id;

  ToDo.findById(todo_id, function (err, todo){
    res.render('edit_todo', {
      todo : todo
    });
  });
  
});

//post data
app.post('/new_todo', function (req, res){
  //prep data 
  var newToDo = new ToDo({
    title: req.body.title,
    description: req.body.description,
    is_done: false,
    created_at: new Date()
  });
  //save data to db (mongodb via mongoose)
  newToDo.save(function (err){
    if(err) throw err;
    res.redirect('/');
  });
});

app.put('/todos/:id', function (req, res){
  //prep data
  var todo_id = req.params.id;
  ToDo.findById(todo_id, function(err, todosFromDB){
    todosFromDB.title = req.body.title;
    todosFromDB.description = req.body.description;

    todosFromDB.save(function (err){
      if(err) throw err;
      res.redirect('/');
    });
  });
});


//delete item in todo list
app.delete('/todos/:id', function (req, res){
  var todo_id = req.params.id; //req.params for dynamic url 
  ToDo.findById(todo_id, function (err, todo){ //find todo item by id
    todo.remove(function() { //remove todo item
      res.redirect('/'); //redirect by to list page
    });
  });
});

//put data
app.put('/todos/:id/complete', function (req, res){
  // var todo_id = req.params.id;
  console.log("update");
  ToDo.update({_id: req.params.id},
    {is_done : true}, 
     function (err, todo){
      if (err) throw err;
      res.send("okay");
      // res.redirect('/');
    });
});

app.put('/todos/:id/incomplete', function (req, res){
  // var todo_id = req.params.id;
  // console.log("update");
  ToDo.update({_id: req.params.id},
    {is_done : false}, 
     function (err, todo){
      if (err) throw err;
      res.send("okay");
      // res.redirect('/'); //ajax can't do redirect
    });
});


//localhost3000
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});