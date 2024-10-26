import './style.css'
import Radar from 'radar-sdk-js';
import 'radar-sdk-js/dist/radar.css'

document.addEventListener("DOMContentLoaded", function() {
  Radar.initialize('prj_live_pk_a4d20e65502f5467fa6b8f3692cb24e9cf493b5b');

  const map = Radar.ui.map({
    container: 'map', // OR document.getElementById('map')
    style: 'radar-default-v1',
    center: [0,0], // NYC
    zoom: 2,
  });

  map.on('load', () => {
      class HeaderControl {
        onAdd(map) {
          const div = document.createElement("div");
          div.innerHTML = `<span style="font-size:1.1rem;font-weight:bold">Thai Restaurants</span><br>Restaurants approved/recommended by the Thai Government.<br/>See <a href="https://github.com/gregsadetsky/thai-restaurants" target="_blank">source code</a>. See <a href="https://thaiselect.com/" target="_blank">data</a>. A project by <a href="https://greg.technology/" target="_blank">Greg Technology</a>.`;
          div.style.background = 'white'
          div.style.padding='10px'
          // pointer-events: auto;
          div.style.pointerEvents = 'auto';
          return div;

          // this.container.className = 'mapboxgl-ctrl my-custom-control';
        }
      }
      const control = new HeaderControl();
      map.addControl(control, "top-left");

      // attempt to load a location for the user's ip
      // fetch from https://api.radar.io/v1/geocode/ip
      // passing the API key as Authorization header
      fetch('https://api.radar.io/v1/geocode/ip', {
        headers: {
          'Authorization': 'prj_live_pk_a4d20e65502f5467fa6b8f3692cb24e9cf493b5b'
        }
      }).then((response) => {
        return response.json();
      }).then((data) => {
        map.flyTo({
          center: data.address.geometry.coordinates,
          zoom: 7
        });
      });

      map.addSource('thai', {
          type: 'geojson',
          // Use a URL for the value for the `data` property.
          data: '/thai-restaurants.geojson'
      });

      map.addLayer({
          'id': 'thai-layer',
          'type': 'circle',
          'source': 'thai',
          'paint': {
              'circle-radius': 6,
              'circle-stroke-width': 2,
              'circle-color': 'red',
              'circle-stroke-color': 'white'
          }
      });

      map.on('click', function (e) {
          var features = map.queryRenderedFeatures(e.point, { layers: ['thai-layer'] });

          if (!features.length) {
              return;
          }

          var feature = features[0];
          // Use Feature and put your code
          // Populate the popup and set its coordinates
          // based on the feature found.
          var popup = Radar.ui.popup({
            html: `<b>${feature.properties.name}</b><br/>${feature.properties.address}`
          })
              .setLngLat(feature.geometry.coordinates)
              .addTo(map);
      });

      map.on('mousemove', function (e) {
          var features = map.queryRenderedFeatures(e.point, { layers: ['thai-layer'] });
          map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
      });
  });
});
