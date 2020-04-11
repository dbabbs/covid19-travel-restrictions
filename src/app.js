import constructPolygon from './constructCountryOutline.js';
import { countryMap } from './countries.js';
import geometryFetcher from './GeometyFetcher.js';
import Tooltip from './Tooltip.js';
import { apikey, center, zoom } from './config.js';

const tooltip = new Tooltip();
const platform = new H.service.Platform({ apikey });
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

const router = platform.getRoutingService();
window.addEventListener('resize', () => map.getViewPort().resize());
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const provider = map.getBaseLayer().getProvider();
const style = new H.map.Style('../static/map-style.yaml');
provider.setStyle(style);

defaultLayers.vector.normal.map.setMax(4);
defaultLayers.vector.normal.map.setMin(2);

async function addCountryOutline(iso3) {
   const object = await constructPolygon(iso3);

   object.addEventListener('pointerenter', (evt) => {
      const { clientX: x, clientY: y } = evt.originalEvent;
      tooltip.show();
      tooltip.position({ x, y });
      tooltip.setContent({ code: iso3 });
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

addCountryOutline('schengen');

const schengen = [
   'Austria',
   'Hungary',
   'Norway',
   'Belgium',
   'Iceland',
   'Poland',
   'Czech Republic',
   'Italy',
   'Portugal',
   'Denmark',
   'Latvia',
   'Slovakia',
   'Estonia',
   'Liechtenstein',
   'Slovenia',
   'Finland',
   'Lithuania',
   'Spain',
   'France',
   'Luxembourg',
   'Sweden',
   'Germany',
   'Malta',
   'Switzerland',
   'Greece',
   'Netherlands',
].map((c) => {
   return {
      name: c,
      iso3: countryMap.find((x) => x.name === c).iso3,
   };
});

(async () => {
   const geometries = schengen.map((x) => geometryFetcher.retrieve(x.iso3));
   const promises = await Promise.all(geometries);
   console.log(promises);

   // const union = turf.union(promises[0], promises[1]);
   // console.log(JSON.stringify(union));

   // let union = turf.union(promises[0], promises[1]);
   // for (let i = 1; i < promises.length - 1; i++) {
   //    try {
   //       const newUnion = turf.union(promises[i], promises[i + 1]);
   //       union = { ...newUnion };
   //       console.log(union);
   //    } catch {
   //       // i++;
   //       const newUnion = turf.union(promises[i], promises[i + 2]);
   //       union = { ...newUnion };
   //       console.log(union);
   //       console.log('failed');
   //    }
   // }
   // console.log(JSON.stringify(union));
})();
