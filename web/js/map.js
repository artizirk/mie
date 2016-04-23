var map = null, infobox, dataLayer;

function got_locaton(position) {
    GetMap(center = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude), zoom = 14)
}


function run_map() {
    if (!navigator.geolocation){
        GetMap(center = new Microsoft.Maps.Location(58.9401034, 24.9793223), zoom = 8)
    } else {
        navigator.geolocation.getCurrentPosition(got_locaton, function(err){
            console.log("err")
            GetMap(center = new Microsoft.Maps.Location(58.9401034, 24.9793223), zoom = 8)
        });
    }
}

function GetMap(center, zoom) {
    
    if (!center) {
        center = new Microsoft.Maps.Location(58.9401034, 24.9793223);
    }

    if (!zoom) {
        zoom = 8;
    }
    // Initialize the map
    map = new Microsoft.Maps.Map(document.getElementById("myMap"), 
		{ credentials: "Ajv_iCOiMv4TeOydBWwpiuvelYzHXfwFYgG4KhiNDTr6VXPkf5BOcGFTWtSrxwwG", 
		center: center, 
		zoom: zoom});

    dataLayer = new Microsoft.Maps.EntityCollection();
    map.entities.push(dataLayer);

    var infoboxLayer = new Microsoft.Maps.EntityCollection();
    map.entities.push(infoboxLayer);

    infobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), { visible: false, offset: new Microsoft.Maps.Point(0, 20) });
    infoboxLayer.push(infobox);
	
    AddData(center);
}

function AddData(home) {

    $.getJSON("/api/v1/museum?lat="+home.latitude+"&lon="+home.longitude+"&ran=40", function(data){
        $.each(data, function(index, value) {
            var pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(value.location.coordinates[0], value.location.coordinates[1]), 
                                                {icon: 'muse-pin.png', width: 20, height: 36, draggable: false});
            pin.Title = value.name;
            pin.Description = value.address + "<br>"+ value.open_times;
            Microsoft.Maps.Events.addHandler(pin, 'click', displayInfobox);
            dataLayer.push(pin);
        })
    })
    var pin1 = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(59.436375, 24.796889), {icon: 'muse-pin.png', width: 20, height: 36, draggable: true});
    pin1.Title = "Muuseumi nimi";
    pin1.Description = "Muuseumi lühitutvustus, lahtiolekuajad jne.";
    Microsoft.Maps.Events.addHandler(pin1, 'click', displayInfobox);
    dataLayer.push(pin1);

    var pin2 = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(59.451439, 24.738400), {icon: 'muse-pin.png', width: 20, height: 36, draggable: true});
    pin2.Title = "Muuseumi nimi";
    pin2.Description = "Muuseumi lühitutvustus, lahtiolekuajad jne.";
    Microsoft.Maps.Events.addHandler(pin2, 'click', displayInfobox);
    dataLayer.push(pin2);
}

function displayInfobox(e) {
    if (e.targetType == 'pushpin') {
        infobox.setLocation(e.target.getLocation());
        infobox.setOptions({ visible: true, title: e.target.Title, description: e.target.Description });
    }
}  
