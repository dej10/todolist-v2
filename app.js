const express = require("express");
const bodyParser = require("body-parser");
const mongoose =  require("mongoose");
const _ = require("lodash");


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-arcane:<PASSWORD>@cluster0.ywbwq.mongodb.net/<DBNAME>", {
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false
}); 


const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

let day = today.toLocaleDateString("en-US", options);


const itemsSchema = new mongoose.Schema({
	name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
	name: "<-- Hit the checkox to delete items"
});

const item2 = new Item({
	name: "Hit the + button to add new items"
});


const listsSchema = new mongoose.Schema({
	name: String,
	items: [itemsSchema]
});

const List = mongoose.model("List", listsSchema);


const defaultArray = [item1, item2];


app.get("", function (req, res) {
Item.find({}, function(err, foundItems) {
	if (foundItems.length === 0) {
		Item.insertMany(defaultArray, function (err) {
			if(err)
				console.log(err);
			else {
				console.log("Default items saved to DB");
			}
		});

		res.redirect("/");
		} else {
			res.render("lists", {
        	dayName: day,
        	listItems: foundItems
   		 	});
		}
	});
    


});


app.get("/:listName", function(req, res) {

    let listName = _.capitalize(req.params.listName);




    List.findOne({ name: listName }, function(err, foundLists) {
        if (!err) {
            if (!foundLists) {
                const list = new List({
                    name: listName,
                    items: defaultArray
                });
                list.save();
                res.redirect("" + listName);
            } else {
                res.render("lists", {
                    dayName: foundLists.name,
                    listItems: foundLists.items
                });
            }

        }


    });




});




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


app.post("/delete" , function (req, res) {
	
	const checkedID = req.body.checkbox;
	const listName = req.body.listName;


	if (listName === day) {
		Item.findByIdAndRemove(checkedID, function (err) {
		if (!err) {
			console.log("Items Deleted");
			res.redirect("/");
		}
	});
		
	} else { 
		List.findOneAndUpdate(
			{name: listName},
			{$pull : {items : {_id: checkedID }}},
			function  (err, results) {
				if(!err)
					res.redirect("" + listName);
				
			});

		}
		
});


app.listen(process.env.PORT || 3000	, function(){
	console.log("Server is running on port 3000 ......")
});

