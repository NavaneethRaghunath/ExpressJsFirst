// jshint esversion : 6
//https://sleepy-ridge-70059.herokuapp.com/


const express = require("express");
const bodyParser = require("body-parser");
const fmtDate = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _= require("lodash");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://nava-admin:N$7icolekidman@cluster0-c6c6x.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
    todoItem : String
});

const Item = mongoose.model("item",itemSchema)

const ItemA = new Item({
    todoItem : "Welcome to TODO List"
});

const ItemB = new Item({
  todoItem : "Press + to add an item"
});

const ItemC = new Item({
  todoItem : "Press check box to strike out an item"
});

const defaultList = [ItemA,ItemB,ItemC];

const listSchema = new mongoose.Schema({
  name : String,
  items : [itemSchema]
});

const list = mongoose.model("list", listSchema);

let port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}

app.listen(port, ()=>{
  console.log("server started");
});

//let items = ["shopping","parking", "dining"];
let workItems = [];
let dayName = fmtDate.gDay();
app.get("/",(req,res)=>{
//  res.sendFile(__dirname + "/index.html");

  Item.find({},(err,fields)=>{
    if (err){
      console.log(err);
    }else
      if (fields.length === 0) {
        Item.insertMany(defaultList,(err)=>{
          if (err){
            console.log("Error");
          }else{
            console.log("insert success");
          }
        });
        res.redirect("/");
      }else {
    res.render("list", {today:dayName, item:fields});
     }
  });
});


app.post("/",(req,res)=>{
  // let ls = req.body.newItem
  // if (req.body.listDiff === "workList"){
  //   workItems.push(ls);
  //   res.redirect("/work");
  // }else{
  //   items.push(ls);
  //   res.redirect("/");
  // }

  const newItem = req.body.newItem;
  const item = new Item({
    todoItem : newItem
  });

 if (req.body.listDiff === dayName){
   item.save();
  res.redirect("/");
 } else{
   list.findOne({name : req.body.listDiff},(err,field)=>{
     field.items.push(item)
     field.save();
     res.redirect("/" + req.body.listDiff);
   })
 }
});

app.post("/delete",(req,res)=>{
  const checkedItem = req.body.checkedBox;
  if (req.body.pageTitle === dayName){
    Item.findByIdAndRemove(checkedItem,(err)=>{
      if (!err){
        console.log("success")
      }
    })
    res.redirect("/")
  }
  else{
    list.findOneAndUpdate({name : req.body.pageTitle},{$pull: {items: {_id: checkedItem}}},(err, field)=>{
      if (!err){
        res.redirect("/" + req.body.pageTitle);
      }
    })
  }
});

//
// app.get("/work",(req,res)=>{
//   res.render("list", {today:"workList", item:workItems});
// });

app.get("/:webName",(req,res)=>{
  const webName = _.capitalize(req.params.webName);
  list.findOne({name : webName},(err,field)=>{
    if (err){
      console.log(err);
    }else if(!field){
      const listA = new list({
        name : webName,
        items : defaultList
      });
    listA.save();
    console.log("success");
    }else{
      res.render("list", {today:field.name, item:field.items});
    }
  })
});

app.get("/about", (req,res)=>{
  res.render("about");
});
