import hexToRgba from './util/hexToRgba.js';
import { colors } from './config.js';

async function constructMapPolygon(feature) {
   const geometry =
      feature.geometry.type === 'MultiPolygon'
         ? constructMultiPolygon(feature)
         : constructPolygon(feature);
   return new H.map.Polygon(geometry, {
      style: {
         fillColor: hexToRgba(colors.red, 0.1),
         strokeColor: hexToRgba(colors.red, 0.5),
         lineWidth: 2,
         zIndex: -1,
      },
   });
}

function constructPolygon(feature) {
   const { coordinates } = feature.geometry;
   console.log(coordinates[0]);
   const output = coordinates[0].map((x) => [x[1], x[0], 0]).flat();
   // console.log(output);
   const lineString = new H.geo.LineString(output);
   return new H.geo.Polygon(lineString);
}

function constructMultiPolygon(feature) {
   const { coordinates } = feature.geometry;
   const multiPolygons = coordinates.map(([row]) => {
      const output = row.map((x) => [x[1], x[0], 0]).flat();
      const lineString = new H.geo.LineString(output);
      return new H.geo.Polygon(lineString);
   });
   return new H.geo.MultiPolygon(multiPolygons);
}
export default constructMapPolygon;
