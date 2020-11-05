# todolist-v2
a todolist web app built using ejs templating with mongoose , mongoDB and mongoAtlas

```JSON
npm packages used {
  express,
  body-parser,
  mongoose,
  lodash
}

```

## Server Starting Code

```javascript

const express = require("express");
const bodyParser = require("body-parser");
const mongoose =  require("mongoose");
const _ = require("lodash");


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.ywbwq.mongodb.net/<DBNAME>", {
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false
});

```


## Adding new items

EJS


```ejs
<%- include('header'); -%>
	<body class="body">
		<div class="box" id="#heading">
			<h1> <%= dayName %> </h1>
		</div>
		<div class="box">

			<% listItems.forEach(function(item){ %>
				<form action="/delete" method="post">
				<div class="item">
					<input onChange="this.form.submit()" name ="checkbox" value="<%=item._id%>" class="regular-checkbox" type="checkbox">
					 <p> <%= item.name %> </p>
				</div>
				<input type="hidden" name="listName" value = "<%= dayName %>">
				</form>
				<% }); %>
			</div>
			



			<form  autocomplete="off" class="input" action="/" method="post" accept-charset="utf-8">
				<input type="text" name="newlistItem" placeholder="new item" required>
				<button name="list" value = "<%= dayName %>" type="submit">+</button>
			</form>
			
			
		</body>
		<%- include('footer'); -


```
JS
```javascript


app.post("/", function (req, res) {

	const itemName = req.body.newlistItem;
	const nameOflist = req.body.list;

	const item = new Item({
		name: itemName
	});

	if (nameOflist === day) {
		item.save();
		res.redirect("/");
		
	} else { 
		List.findOne({name: nameOflist}, function (err, foundList) {
			foundList.items.push(item);
			foundList.save();
			res.redirect("/" + nameOflist);
		});
		
	}

});

```
