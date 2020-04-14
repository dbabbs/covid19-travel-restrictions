import Tooltip from './components/Tooltip.js';
import { mobileActive } from './config.js';
import { fetchCountryData, fetchCountryBoundaries } from './util/fetchData.js';
import Sidebar from './components/Sidebar.js';
import Map from './components/Map.js';

const tooltip = new Tooltip();
const sidebar = new Sidebar();
const map = new Map(tooltip);

(async () => {
   if (mobileActive()) {
      sidebar.calculateHeights();
   }
   const data = await fetchCountryData();
   const codes = data.map((x) => x.code);
   const boundaries = await fetchCountryBoundaries(codes);
   console.log(
      'feature lengths match: ' + (data.length === boundaries.features.length)
   );

   boundaries.features
      .map((x) => {
         x.properties = data.find((z) => x.properties.ADM0_A3 === z.code);
         return x;
      })
      .forEach((country) => {
         map.addObject(country);
      });

   sidebar.setContent(data);
})();
