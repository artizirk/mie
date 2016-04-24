env = new nunjucks.Environment(new nunjucks.WebLoader('/templates', {async: true}), {autoescape: true}),


app = {
    templates: {},

    init: function() {
        $("#sample1").keyup(function (e) {
            if (e.keyCode == 13) {
                app.preSearch(e)
            }
        });
        $("#sample1").val("").focus()
        this.compileTemplates()

        //setInterval(this.changeText, 1000);
        this.changeText()
        this.mainMap = new Microsoft.Maps.Map(document.getElementById("main-map"), 
                            { credentials: "Ajv_iCOiMv4TeOydBWwpiuvelYzHXfwFYgG4KhiNDTr6VXPkf5BOcGFTWtSrxwwG", 
                              showDashboard: false,
                              center: new Microsoft.Maps.Location(58.7, 25.0), 
                              zoom: 8});

        this.dataLayer = new Microsoft.Maps.EntityCollection();
        this.mainMap.entities.push(this.dataLayer);

        var infoboxLayer = new Microsoft.Maps.EntityCollection();
        this.mainMap.entities.push(infoboxLayer);

        infobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), { visible: false, offset: new Microsoft.Maps.Point(0, 20) });
        infoboxLayer.push(infobox);
        this.getMyPosition();

        $("#search-view").on("click", ".museum-element", function(ev) {
            $.getJSON("/api/v1/museum/"+$(this).data("id"), function(data){
                $("#search-view").addClass("hidden");
                $("#details").removeClass("hidden");
                var r = env.render("details.html", { museum:data}, function(err, res) {
                    $("#details").html(res)
                });
            });
        });
    },

    home: function() {
        if ($("#landing-search").hasClass("landing_target") && $("#details").hasClass("hidden")) {
            $('#spinner').addClass("hidden");
            $('#landing-search').removeClass('landing_target')
            $('#results').addClass('hidden')
            $("#sample1").val("").focus()
            $("#sample1").parent().removeClass("is-dirty");

        }
        $("#search-view").removeClass("hidden");
        $("#details").addClass("hidden");
        

    },

    changeText: function() {
        $("#search_label").typed({
        strings: ["kunst", "lennukid", "loodus", "tehnika", "merendus", "ajalugu", "lastele", "vabaõhumuuseum"],
        typeSpeed: 100,
        showCursor: false,
        backDelay: 1500,
        loop: true,
        preStringTyped: function(pos) {

        },
      });
    },

    compileTemplates: function() {},

    preSearch: function(e) {
        $("#spinner").removeClass("hidden");
        window.setTimeout(app.startSearch, 1000);
    },

    startSearch: function(e) {
        console.log(e)
        $('#spinner').addClass("hidden");
        $('#landing-search').addClass('landing_target')
        $('#results').removeClass('hidden')
        $.getJSON("/api/v1/museum?q="+$("#sample1").val(), function(data){
            var r = env.render("results.html", { results:data}, function(err, res) {
                $("#results-list").html(res)
            });
            var longitude = 0;
            var longitudes = [];
            var latitude = 0;
            var latitudes = [];
            app.dataLayer.clear();

            var locations = [];



            $.each(data, function(index, value){
                if (!value.location) {
                    return;
                }
                var loc = new Microsoft.Maps.Location(value.location.coordinates[0], value.location.coordinates[1])
                var pin = new Microsoft.Maps.Pushpin(loc, {icon: 'muse-pin.png', width: 20, height: 36, draggable: false});
                //locations.push(loc);
                pin.Title = value.name;
                pin.Description = value.address + "<br>"+ value.open_times;
                Microsoft.Maps.Events.addHandler(pin, 'click', app.displayInfobox);
                app.dataLayer.push(pin);
                longitude += value.location.coordinates[1];
                //longitudes.push(value.location.coordinates[1])
                latitude += value.location.coordinates[0];
                //latitudes.push(value.location.coordinates[0])
            });

            longitude = longitude / data.length;
            console.log("longitude: "+longitude);//+" max-min:" + (Math.max(...longitudes) - Math.min(...longitudes)));
            latitude = latitude / data.length;
            console.log("latitude: "+latitude );//+ " max-min:"+ (Math.max(...latitudes) - Math.min(...latitudes)));

            //console.log(locations)
            //var viewBoundaries = Microsoft.Maps.LocationRect.fromLocations(...locations);

            //app.mainMap.setView({ bounds: viewBoundaries});

            app.mainMap.setView({
                center: new Microsoft.Maps.Location(58.7001034, 24.9793223),// new Microsoft.Maps.Location(latitude, longitude),
                zoom: 8,
            });

        }.bind(this));
    }.bind(this),

    displayInfobox: function(e) {
        if (e.targetType == 'pushpin') {
            infobox.setLocation(e.target.getLocation());
            infobox.setOptions({ visible: true, title: e.target.Title, description: e.target.Description });
        }
    },


    getMyPosition: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(app.gotMyPostition.bind(this), console.error);
        }
    },

    gotMyPostition: function(position) {
        app.mainMap.setView({
            center: new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude),
            zoom: 14,
        });
    },
}
