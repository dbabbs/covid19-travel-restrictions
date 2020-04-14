import constructMapPolygon, {
   createObjectStyle,
} from './constructMapPolygon.js';
import Tooltip from './components/Tooltip.js';
import {
   credentials,
   center,
   zoom,
   minZoom,
   maxZoom,
   colorMap,
   mobileActive,
} from './config.js';
import { fetchCountryData, fetchCountryBoundaries } from './fetchData.js';
import hexToRgba from './util/hexToRgba.js';
import Flag from './components/Flag.js';
import Sidebar from './Sidebar.js';

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

const sidebar = new Sidebar();

async function addObjectToMap(feature) {
   const object = await constructMapPolygon(feature);
   const { classification } = feature.properties;
   object.addEventListener('pointerenter', (evt) => {
      if (!mobileActive()) {
         const { clientX: x, clientY: y } = evt.originalEvent;
         tooltip.show();
         tooltip.position({ x, y });
         tooltip.setContent(feature.properties);
      }

      // object.setStyle(createObjectStyle(classification, 'hover'));
   });

   object.addEventListener('pointermove', (evt) => {
      if (!mobileActive()) {
         const { clientX: x, clientY: y } = evt.originalEvent;
         tooltip.position({ x, y });
      }
   });

   object.addEventListener('pointerleave', () => {
      if (!mobileActive()) {
         tooltip.hide();
      }
   });

   //For mobile
   object.addEventListener('tap', () => {
      if (mobileActive()) {
         tooltip.showMobile();
         tooltip.setMobileContent(feature.properties);
      }
   });

   map.addObject(object);
}

(async () => {
   if (mobileActive()) {
      sidebar.calculateHeights();
   }
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

   populateSidebar(joined);
})();

async function populateSidebar(data) {
   const classifications = [
      ...new Set(data.map((x) => x.properties.classification)),
   ];
   const categories = {};
   data.forEach((row) => {
      if (categories.hasOwnProperty(row.properties.classification)) {
         categories[row.properties.classification].push({
            name: row.properties.country,
            code: row.properties.code,
         });
      } else {
         categories[row.properties.classification] = [
            {
               name: row.properties.country,
               code: row.properties.code,
            },
         ];
      }
   });

   sidebar.set(categories);
}
