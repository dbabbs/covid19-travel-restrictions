import hexToRgba from './hexToRgba.js';
import { colorMap } from '../config.js';

export function createObjectStyle(classification, id, state = 'normal') {
   return {
      fillColor: hexToRgba(colorMap[id], state === 'normal' ? 0.1 : 0.2),
      strokeColor: hexToRgba(colorMap[id], 0.5),
      lineWidth: 2,
      zIndex: -1,
   };
}

async function constructMapPolygon(feature) {
   const geometry =
      feature.geometry.type === 'MultiPolygon'
         ? constructMultiPolygon(feature)
         : constructPolygon(feature);
   const { classification, classification_id: id } = feature.properties;
   const style = createObjectStyle(classification, id);
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
