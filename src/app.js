import constructMapPolygon from './constructMapPolygon.js';
import Tooltip from './Tooltip.js';
import { credentials, center, zoom, minZoom, maxZoom } from './config.js';
import { fetchCountryData, fetchCountryBoundaries } from './fetchData.js';

const tooltip = new Tooltip();
const platform = new H.service.Platform({ apikey: credentials.apikey });
const defaultLayers = platform.createDefaultLayers();
const map = new H.Map(
   document.querySelector('.map'),
   defaultLayers.vector.normal.map,
   {
      center,
      zoom,
      pixelRatio: window.devicePixelRatio || 1,
   }
);
window.addEventListener('resize', () => map.getViewPort().resize());
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const provider = map.getBaseLayer().getProvider();
const style = new H.map.Style('../static/map-style.yaml');
provider.setStyle(style);

defaultLayers.vector.normal.map.setMax(maxZoom);
defaultLayers.vector.normal.map.setMin(minZoom);

async function addObjectToMap(feature) {
   const object = await constructMapPolygon(feature);

   object.addEventListener('pointerenter', (evt) => {
      const { clientX: x, clientY: y } = evt.originalEvent;
      tooltip.show();
      tooltip.position({ x, y });
      tooltip.setContent(feature.properties);
   });

   object.addEventListener('pointermove', (evt) => {
      const { clientX: x, clientY: y } = evt.originalEvent;
      tooltip.position({ x, y });
   });

   object.addEventListener('pointerleave', () => {
      tooltip.hide();
   });

   map.addObject(object);
}

(async () => {
   const data = await fetchCountryData();
   const codes = data.map((x) => x.code);
   console.log(new Set(data.map((x) => x.classification)));

   const boundaries = await fetchCountryBoundaries(codes);
   console.log(
      'feature lengths match: ' + (data.length === boundaries.features.length)
   );

   const joined = boundaries.features.map((x) => {
      x.properties = data.find((z) => x.properties.ADM0_A3 === z.code);
      return x;
   });

   joined.forEach((country) => {
      addObjectToMap(country);
   });
})();
