/**
 * Using oracle map viewer APIs version1
 */
var MapsOracle = function() {

    var showMap = function() {
        // Global clicked element
        ElementPointService.elementId = -1;
        var canAddOracleElement = false;

        var baseUrl = TehranMV.gv.mapviewer_baseURL;
        var mapCenterLon =  51.4231;
        var mapCenterLat =  35.6961;
        var mapZoom      =  10;  
        var mpoint = MVSdoGeometry.createPoint(mapCenterLon,mapCenterLat,8307);
        var mapview = new MVMapView(document.getElementById("gmap_basic"), baseUrl);

        // Configure oracle map viewer
        mapview.addMapTileLayer(new MVMapTileLayer("mvdemo.demo_map")); 
        mapview.setCenter(mpoint); 
        mapview.setZoomLevel(mapZoom);    
        mapview.display();

        // Declare map listeners.
        setMapListener();

        /**
         * Add markers when click on the .add-markers element.
         */
        $('.add-markers').click(
            function (event) {
                // Remove all markers in the map.
                mapview.removeAllFOIs();

                // Globally update elementId in the clicked element scope.
                ElementPointService.elementId = event.target.id.split("-")[1];

                // Request element locations and create markers in map.
                ElementPointService.getElementLocations(function(points) {
                    addFoi(points);
                });

                // Update global element attributes to use in create attribute for after click on the markers.
                ElementPointService.getElementAttributes();
            });

        /**
         * function to change cursor in the map.
         */
        var changeCursor = function() {
            if (canAddOracleElement) {
                mapview.setMouseCursorStyle("crosshair", "default");
            } else {
                mapview.setMouseCursorStyle("default", "default") ;
            }
        };

        /**
         * write event listeners to listen for such events as mouse clicking and recentering of the map.
         */
        function setMapListener() 
        {	
            mapview.attachEventListener(MVEvent.MOUSE_CLICK, mouseClick);
        }

        /**
         * Mouse click map event
         */
        function mouseClick() {
            if (!canAddOracleElement) {
                return;
            }
            canAddOracleElement = false;
            changeCursor();
            var mouseLoc = mapview.getMouseLocation();
            // Log in the console.
            logIntendedData(mouseClick.name, "Clicked: " + mouseLoc.getPointX() + " " + mouseLoc.getPointY(), null);
            // Ajax request to create element point.
            ElementPointService.createElementPoint(mouseLoc.getPointX(), mouseLoc.getPointY());
        }

        /**
        * Function to affect addMarker. When user clicked on .add-marker element,
        * then can add marker in the map.
        */
        $('.add-marker').click(
            function(event) {
                canAddOracleElement = true;
                // Globally update elementId in the clicked element scope.
                ElementPointService.elementId = event.target.id.split("-")[1];
                changeCursor();
            });

        /**
         * Add map markers
         * @param {any} elementLocationsDto
         */
        function addFoi(elementLocationsDto) {
            var count = elementLocationsDto.Count;

            canAddOracleElement = false;

            // Add marker for each element.
            for (var i = 0; i < count; i++) {
                var elementPoint =
                {
                    latitude: elementLocationsDto.ElementPoints[i].Geom.Latitude,
                    longitude: elementLocationsDto.ElementPoints[i].Geom.Longitude,
                    UrbanElementPointId: elementLocationsDto.ElementPoints[i].UrbanElementPointId
                };

                var iPoint = MVSdoGeometry.createPoint(elementPoint.longitude, elementPoint.latitude, 8307);
                var iFoi = MVFOI.createMarkerFOI(TehranMV.util.generateRandomUnique(),
                    iPoint,
                    TehranMV.util.getMaprkerIcon(elementLocationsDto.ElementPoints[i].CurrentState),
                    10,
                    10);;
                iFoi.setInfoTip(elementPoint.UrbanElementPointId);
                iFoi.attachEventListener(MVEvent.MOUSE_CLICK,
                    function(evt, mvfoi) {
                        // Get element point and then show element attribute form.
                        ElementPointService.getElementPoint(mvfoi.infoTip);
                    });

                mapview.addFOI(iFoi);
            }
        }

    };

    return {
        /**
         * main function to initiate map samples
         * @returns {} 
         */
        init: function() {
            showMap();
        }

    };

}();
