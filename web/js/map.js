var map = null, infobox, dataLayer;

function GetMap() {
    // Initialize the map
    map = new Microsoft.Maps.Map(document.getElementById("myMap"), 
		{ credentials: "Ajv_iCOiMv4TeOydBWwpiuvelYzHXfwFYgG4KhiNDTr6VXPkf5BOcGFTWtSrxwwG", 
		center: new Microsoft.Maps.Location(58.9401034, 24.9793223), 
		zoom: 8});

    dataLayer = new Microsoft.Maps.EntityCollection();
    map.entities.push(dataLayer);

    var infoboxLayer = new Microsoft.Maps.EntityCollection();
    map.entities.push(infoboxLayer);

    infobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), { visible: false, offset: new Microsoft.Maps.Point(0, 20) });
    infoboxLayer.push(infobox);
	
    AddData();
}

function AddData() {
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