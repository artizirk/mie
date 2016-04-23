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
    this.page = "index.html";
    this.app = app;
}
Index.prototype = Object.create(Page.prototype);
Index.prototype.load = function() {
    this.render({ foo:"bar"});
};
Index.prototype.ondisplay = function(err, res) {
    this.on("click", "a", this.load_museum.bind(this));
}
Index.prototype.load_museum = function() {
    console.log("loading  museum");
    this.alloff();
    this.app.museum.load();
    return false;
}

function Museum(app) {
    this.page = "museum.html";
    this.app = app;
}
Museum.prototype = Object.create(Page.prototype);
Museum.prototype.load = function(){
    this.render({name: "A Museum"});
}
Museum.prototype.ondisplay = function(err, res) {
    this.on("click", "a", this.load_index.bind(this));
}
Museum.prototype.load_index = function(){
    console.log("load index")
    this.alloff()
    this.app.index.load();
    return false;
}



$(document).ready(function(){
    console.log("init");
    var page = {}
    page.index = new Index(page);
    page.museum = new Museum(page);
    page.index.load();

});

