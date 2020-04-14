import constructMapPolygon, {
   createObjectStyle,
} from './constructMapPolygon.js';
import Tooltip, { Pill } from './Tooltip.js';
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
for (let i = 0; i < 3; i++) {
   document.querySelector('.sections').appendChild(manufactureSection());
}
(async () => {
   if (mobileActive()) {
      calculateHeights();
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

async function wait(duration = globalDelay) {
   return new Promise((resolve) => {
      setTimeout(() => {
         resolve();
      }, duration);
   });
}

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

   await wait(500);
   document.querySelector('.sections').innerHTML = '';
   document.querySelectorAll('.shine').forEach((node) => {
      node.classList.remove('shine');
   });
   Object.keys(categories).forEach((row) => {
      // console.log(row[categories]);
      const node = manufactureSection(row, categories[row]);
      document.querySelector('.sections').appendChild(node);
   });

   //set heights
   if (!mobileActive()) {
      calculateHeights();
   }
   // calculateHeights();
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

   document.querySelector(
      '.sections-container'
   ).style.height = sectionHeightSum;
   console.log(sectionHeightSum);
   console.log(document.querySelector('.sections-container').style.height);
}

document.querySelector('.back-button').onclick = () => setBack();
function setBack() {
   document.querySelector(
      '.second-section'
   ).style.transform = `translateX(100%)`;
   document.querySelector('.sections').style.transform = `translateX(0)`;
}

function setForward() {
   document.querySelector('.second-section').style.transform = `translateX(0)`;
   document.querySelector('.sections').style.transform = `translateX(-100%)`;
}
function manufactureSection(category, countries) {
   if (category === undefined && countries === undefined) {
      console.log('shimmer time');
      const node = document.createElement('div');
      node.classList.add('section');
      node.style.borderLeft = `4px solid transparent`;
      node.innerHTML = `
      <div class="top top-inner">
         <div>
            <div style="width: 200px" class="shine">${Pill(
               'Borders closed'
            )}</div>
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
   top.classList.add('top');
   top.style.borderLeft = `4px solid ` + colorMap[category];
   top.onclick = () => {
      if (!mobileActive()) {
         console.log('hit here...');
         const curr = bottom.style.maxHeight;
         console.log(curr);
         bottom.style.maxHeight = curr === '0px' ? '500px' : 0;
      } else {
         console.log('clicking');

         document.querySelector('.second-section-content').innerHTML = ``;
         countries
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach((country) => {
               const node = document.createElement('div');
               node.classList.add('country-row');
               node.innerHTML = `
               ${country.name}
               <div class="cropper">
                  <img src="${flag(country.code)}" />
               </div>
            `;
               document
                  .querySelector('.second-section-content')
                  .appendChild(node);
            });

         setForward();
      }
   };
   top.innerHTML = `
   <div class="top-inner">
   <div>
   <div>${Pill(category)}</div>
   <div class="small">${countries.length} ${
      countries.length > 1 ? 'countries' : 'country'
   }</div>
</div>
<div class="flag-section">
   ${countries
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, numFlags)
      .reverse()
      .map(
         (item, index) =>
            `<div style="position: absolute; transform: translateX(${
               (numFlags - 1 - index) * 12
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
