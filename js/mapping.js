mapboxgl.accessToken = 'pk.eyJ1Ijoic2h1amFsZSIsImEiOiJjamZtZHNweGEweTdjMnFteHBrM3Voa3F1In0.NxLgeQc5wS3KH-AEcJYzzg';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/shujale/cjfkzadbxg48d2sp60a9q0p2a',
  bearing: 33.12,
  center: [-73.995412, 40.730987],
  zoom: 18.05,
  pitch: 0.00
});

var chapters = {
  'washingtonmews': {
    bearing: 33.12,
    center: [-73.995412, 40.730987],
    zoom: 18.05,
    pitch: 0.00
  },
  'newjersey': {
    duration: 6000,
    center: [-74.215621, 40.666913],
    bearing: 11.12,
    zoom: 16.00,
    pitch: 60.00
  },
  'washingtonmews2': {
    bearing: 11.20,
    center: [-73.995911, 40.731478],
    zoom: 17.69,
    pitch: 38.00
  },
  'newjersey2': {
    duration: 6000,
    center: [-74.215621, 40.666913],
    bearing: 11.12,
    zoom: 16.00,
    pitch: 60.00
  },
  'washingtonmews3': {
    bearing: 11.20,
    center: [-73.995911, 40.731478],
    zoom: 17.69,
    pitch: 38.00
  }
};

// On every scroll event, check which element is on screen
window.onscroll = function() {
  var chapterNames = Object.keys(chapters);
  for (var i = 0; i < chapterNames.length; i++) {
    var chapterName = chapterNames[i];
    if (isElementOnScreen(chapterName)) {
      setActiveChapter(chapterName);
      break;
    }
  }
};

var activeChapterName = 'washingtonmews';

function setActiveChapter(chapterName) {
  if (chapterName === activeChapterName) return;

  map.flyTo(chapters[chapterName]);

  document.getElementById(chapterName).setAttribute('class', 'active');
  document.getElementById(activeChapterName).setAttribute('class', '');

  activeChapterName = chapterName;
}

function isElementOnScreen(id) {
  var element = document.getElementById(id);
  var bounds = element.getBoundingClientRect();
  return bounds.top < window.innerHeight && bounds.bottom > 0;
}

// The 'building' layer in the mapbox-streets vector source contains building-height
// data from OpenStreetMap.
map.on('load', function() {
  // Insert the layer beneath any symbol layer.
  var layers = map.getStyle().layers;

  var labelLayerId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
      labelLayerId = layers[i].id;
      break;
    }
  }

  map.addLayer({
    'id': '3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 15,
    'paint': {
      'fill-extrusion-color': '#aaa',

      // use an 'interpolate' expression to add a smooth transition effect to the
      // buildings as the user zooms in
      'fill-extrusion-height': [
        "interpolate", ["linear"],
        ["zoom"],
        15, 0,
        15.05, ["get", "height"]
      ],
      'fill-extrusion-base': [
        "interpolate", ["linear"],
        ["zoom"],
        15, 0,
        15.05, ["get", "min_height"]
      ],
      'fill-extrusion-opacity': .6
    }
  }, labelLayerId);
});
