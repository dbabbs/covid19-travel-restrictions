import constructMapPolygon from './constructMapPolygon.js';
import Tooltip from './Tooltip.js';
import {
   credentials,
   center,
   zoom,
   minZoom,
   maxZoom,
   colorMap,
} from './config.js';
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

   populateSidebar(joined);
})();

function populateSidebar(data) {
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
   console.log(categories);

   Object.keys(categories).forEach((row) => {
      // console.log(row[categories]);
      const node = manufactureSection(row, categories[row]);
      document.querySelector('.sidebar').appendChild(node);
   });
}
function manufactureSection(category, countries) {
   const numFlags = 3;
   const node = document.createElement('div');
   node.classList.add('section');
   node.style.borderRight = '4px solid ' + colorMap[category];
   // node.style.marginLeft = '3px';
   node.innerHTML = `
   <div>
      <div>${category}</div>
      <div class="small">${countries.length} ${
      countries.length > 1 ? 'countries' : 'country'
   }</div>
   </div>
   <div class="flag-section">
      ${countries
         .slice(0, numFlags)
         .sort((a, b) => b.name - a.name)
         .map(
            (item, index) =>
               `<div style="transform: translateX(${
                  (numFlags - index) * 12
               }px);" class="cropper">
                  <img src="https://restcountries.eu/data/${item.code.toLowerCase()}.svg" />
               </div>`
         )
         .join('')}
   </div>`;
   return node;
}
