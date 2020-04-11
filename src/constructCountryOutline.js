import geometryFetcher from './GeometyFetcher.js';
import hexToRgba from './util/hexToRgba.js';
import { colors } from './config.js';

async function constructPolygon(iso3) {
   const country = await geometryFetcher.retrieve(iso3);
   const multiPolygon = constructMultiPolygon(country);
   return new H.map.Polygon(multiPolygon, {
      style: {
         fillColor: hexToRgba(colors.red, 0.1),
         strokeColor: hexToRgba(colors.red, 0.5),
         lineWidth: 3,
         zIndex: -1,
      },
   });
}

export function constructMultiPolygon(geojson) {
   const { coordinates } = geojson.geometry;
   const multiPolygons = coordinates.map(([row]) => {
      const output = row.map((x) => [x[1], x[0], 0]).flat();
      const lineString = new H.geo.LineString(output);
      return new H.geo.Polygon(lineString);
   });
   const multiPolygon = new H.geo.MultiPolygon(multiPolygons);
   return multiPolygon;
}
export default constructPolygon;
