import constructMapPolygon, {
   createObjectStyle,
} from './constructMapPolygon.js';
import Tooltip from './Tooltip.js';
import {
   credentials,
   center,
   zoom,
   minZoom,
   maxZoom,
   colorMap,
   mobileWidth,
} from './config.js';
import { fetchCountryData, fetchCountryBoundaries } from './fetchData.js';
import hexToRgba from './util/hexToRgba.js';
import flag from './util/flag.js';

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
   const { classification } = feature.properties;
   object.addEventListener('pointerenter', (evt) => {
      if (window.innerWidth > mobileWidth) {
         const { clientX: x, clientY: y } = evt.originalEvent;
         tooltip.show();
         tooltip.position({ x, y });
         tooltip.setContent(feature.properties);
      }

      // object.setStyle(createObjectStyle(classification, 'hover'));
   });

   object.addEventListener('pointermove', (evt) => {
      if (window.innerWidth > mobileWidth) {
         const { clientX: x, clientY: y } = evt.originalEvent;
         tooltip.position({ x, y });
      }
   });

   object.addEventListener('pointerleave', () => {
      if (window.innerWidth > mobileWidth) {
         tooltip.hide();
      }
   });

   //For mobile
   object.addEventListener('tap', (evt) => {
      if (window.innerWidth <= mobileWidth) {
         tooltip.showMobile();
         tooltip.setMobileContent(feature.properties);
      }
   });

   map.addObject(object);
}
for (let i = 0; i < 3; i++) {
   document.querySelector('.sections').appendChild(manufactureSection());
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

   document.querySelector('.loading-container').style.opacity = 0;
   document.querySelector('.loading-container').style.visibility = 'hidden';

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

   document.querySelector('.sections').innerHTML = '';
   Object.keys(categories).forEach((row) => {
      // console.log(row[categories]);
      const node = manufactureSection(row, categories[row]);
      document.querySelector('.sections').appendChild(node);
   });

   //set heights

   calculateHeights();
   window.onresize = () => calculateHeights();
}

function calculateHeights() {
   const height = document.querySelector('.sections').offsetHeight;
   const sectionHeightSum = [...document.querySelectorAll('.section')]
      .map((x) => x.offsetHeight)
      .reduce((curr, total) => curr + total);
   console.log(sectionHeightSum);

   const bottoms = document.querySelectorAll('.bottom');
   bottoms.forEach((b) => {
      b.style.height = height - sectionHeightSum;
      console.log(b.style.height);
   });
}
function manufactureSection(category, countries) {
   if (category === undefined && countries === undefined) {
      console.log('shimmer time');
      const node = document.createElement('div');
      node.classList.add('section');
      node.style.borderRight = `4px solid transparent`;
      node.innerHTML = `
      <div class="top top-inner">
         <div>
            <div style="width: 200px" class="shine">adfasdfa</div>
            <div style="width: 100px" class="small shine">asdfadsf</div>
         </div>
         <div class="flag-section">
            <div style="position: absolute; transform: translateX(24px);" class="shine cropper">
               <div class="shine-img"></div>
            </div>
            <div style="position: absolute; transform: translateX(12px);" class="shine cropper">
               <div class="shine-img"></div>
            </div>
            <div style="position: absolute;" class="shine cropper">
               <div class="shine-img"></div>
            </div>
   
         </div>
      </div>`;
      return node;
   }
   const numFlags = 3;
   const node = document.createElement('div');
   node.classList.add('section');

   // node.style.marginLeft = '3px';

   const bottom = document.createElement('div');
   bottom.classList.add('bottom');
   bottom.style.maxHeight = '0px';
   // bottom.innerHTML = `<div style="background: rgb(220, 220, 220); width: 100%; height: 1px"></div>`;
   bottom.innerHTML += countries
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(
         (item, index) =>
            `<div class="country-row" style="${
               index === 0 && `padding-top: 10px`
            }">
               ${item.name}
               <div class="cropper">
                  <img src="${flag(item.code)}" />
               </div>
            </div>`
      )
      .join('');

   const top = document.createElement('div');
   top.onmouseenter = () => {
      top.style.background = hexToRgba(colorMap[category], 0.08);
   };
   top.onmouseleave = () => {
      top.style.background = '';
   };
   top.classList.add('top');
   top.style.borderRight = `4px solid ` + colorMap[category];
   top.onclick = () => {
      const curr = bottom.style.maxHeight;
      console.log(curr);
      bottom.style.maxHeight = curr === '0px' ? '500px' : 0;
   };
   top.innerHTML = `
   <div class="top-inner">
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
            `<div style="position: absolute; transform: translateX(${
               (numFlags - index) * 12
            }px);" class="cropper">
               <img src="${flag(item.code)}" />
            </div>`
      )
      .join('')}
</div>
   </div>
   `;
   node.appendChild(top);

   node.appendChild(bottom);

   return node;
}
