import hexToRgba from './hexToRgba.js';
import { colorMap } from '../config.js';

export function createObjectStyle(classification, state = 'normal') {
   return {
      fillColor: hexToRgba(
         colorMap[classification],
         state === 'normal' ? 0.1 : 0.2
      ),
      strokeColor: hexToRgba(colorMap[classification], 0.5),
      lineWidth: 2,
      zIndex: -1,
   };
}

async function constructMapPolygon(feature) {
   const geometry =
      feature.geometry.type === 'MultiPolygon'
         ? constructMultiPolygon(feature)
         : constructPolygon(feature);
   const { classification } = feature.properties;
   const style = createObjectStyle(classification);
   return new H.map.Polygon(geometry, { style });
}

function constructPolygon(feature) {
   const { coordinates } = feature.geometry;
   const output = coordinates[0].map((x) => [x[1], x[0], 0]).flat();
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
