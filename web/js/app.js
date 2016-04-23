var env = new nunjucks.Environment(new nunjucks.WebLoader('/templates', {async: true}), {autoescape: true});

function Page(){}
Page.prototype.load = function() {
    this.render();
};
Page.prototype.render = function(data) {
    console.log(this)
    env.render(this.page, data, this.display.bind(this))
};
Page.prototype.display = function(err, res) {
    console.log(this)
    if (err) {
        console.error(err);
        return;
    }
    $("#content").html(res);
    this.ondisplay(err, res)
};
Page.prototype.ondisplay = function(){}
Page.prototype.on = function(event, selector, callback) {
    if (!('events' in this)) {
        this.events = [];
    }
    console.log(this);

    this.events.push([event, selector, callback])
    $("#content").on(event, selector, callback);
}
Page.prototype.alloff = function() {
    for (var i = this.events.length - 1; i >= 0; i--) {
        var event = this.events[i];
        $("#content").off(event[0], event[1], event[2]);
    }
}

function Index(app) {
    this.page = "index.njk";
    this.app = app;
}
Index.prototype = Object.create(Page.prototype);
Index.prototype.ondisplay = function(err, res) {
    this.on("click", "button.btn1", this.load_topics.bind(this));
	this.on("click", "button.btn2", this.load_locations.bind(this));
	this.on("click", "a.search", this.load_search.bind(this));
}
Index.prototype.load_topics = function() {
    console.log("loading  museum");
    this.alloff();
    this.app.topics.load();
    return false;
}
Index.prototype.load_locations = function() {
    console.log("loading  locations");
    this.alloff();
    this.app.locations.load();
    return false;
}
Index.prototype.load_search = function() {
	console.log("loading  search");
	this.alloff();
	this.app.search.load();
	return false;
}
function Topics(app) {
    this.page = "topics.njk";
    this.app = app;
}
Topics.prototype = Object.create(Page.prototype);
Topics.prototype.ondisplay = function(err, res) {
	this.on("click", "button.btn2", this.load_locations.bind(this));
}
Topics.prototype.load_locations = function() {
    console.log("loading  locations");
    this.alloff();
    this.app.locations.load();
    return false;
}
function Locations(app) {
    this.page = "locations.njk";
    this.app = app;
}
Locations.prototype = Object.create(Page.prototype);
Locations.prototype.ondisplay = function(err, res) {
	this.on("click", "button.btn1", this.load_topics.bind(this));
}
Locations.prototype.load_topics = function() {
    console.log("loading  topics");
    this.alloff();
    this.app.topics.load();
    return false;
}

function Search(app) {
    this.page = "search.njk";
    this.app = app;
}
Search.prototype = Object.create(Page.prototype);




$(document).ready(function(){
    console.log("init");
    var page = {}
    page.Index = new Index(page);
    page.topics = new Topics(page);
	page.locations = new Locations(page);
	page.search = new Search(page);
    page.Index.load();

});

