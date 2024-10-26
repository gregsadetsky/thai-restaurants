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
            html: `${feature.properties.name}<br/>${feature.properties.address}`
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
