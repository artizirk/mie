var env = new nunjucks.Environment(new nunjucks.WebLoader('/templates', {async: true}), {autoescape: true});

var index = {
    page: "index.html",

    render: function(){
        data = { foo: 'bar' };
        env.render(this.page, data, this.display.bind(this));
    },

    display: function(err, res){
        if (err) {
            console.log(err);
            return;
        }
        $("#content").html(res);
        $("#content").on("click", "a", this.load_museum);
    },

    load_museum: function() {
        console.log("loading  museum");
        $("#content").off("click", "a", this.load_museum);
        museum.render();
        return false;
    }.bind(this),
}

var museum = {
    page: "museum.html",

    render: function(){
        data = { name: "A Museum" };
        env.render(this.page, data, this.display.bind(this));
    },

    display: function(err, res) {
        if (err) {
            console.log(err);
            return;
        }
        $("#content").html(res);
        $("#content").on("click", "a", this.load_index);
    },

    load_index: function(){
        console.log("load index")
        $("#content").off("click", "a", this.load_index);
        index.render();
        return false;
    }.bind(this)


}

$(document).ready(function(){
    console.log("init");
    index.render();

});

