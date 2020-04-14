import { credentials } from '../config.js';
import jsonFetcher from './fetch.js';

async function fetchCountryData() {
   const base = (sheetNumber) =>
      `https://spreadsheets.google.com/feeds/cells/1ayVxennSpqejr3aytsQLn4b0tyOEW6wmGsOdhjPr3yA/${sheetNumber}/public/full?alt=json`;

   const [data, config] = await Promise.all([
      jsonFetcher(base(2)),
      jsonFetcher(base(3)),
   ]);

   const configMap = {};
   for (let i = 0; i < config.feed.entry.length; i += 2) {
      const val = config.feed.entry[i].content.$t;
      const next = config.feed.entry[i + 1].content.$t;
      configMap[val] = next;
   }
   const numCols = 7;

   const columns = data.feed.entry.slice(0, numCols).map((x) => x.content.$t);
   const tableCells = data.feed.entry.slice(numCols, data.feed.entry.length);
   const output = [];
   for (let i = 0; i < tableCells.length / numCols; i++) {
      const row = {};
      for (let j = 0; j < numCols; j++) {
         row[columns[j]] = tableCells[i * numCols + j].content.$t;
      }
      output.push(row);
   }
   output.forEach((row) => {
      row.classification_id = +row.classification_id;
      row.classification = configMap[row.classification_id];
   });
   return output;
}

async function fetchCountryBoundaries(codes) {
   const base = `https://xyz.api.here.com/hub/spaces/${credentials.id}/search?access_token=${credentials.token}`;
   const url = base + codes.map((code) => `&tags=ADM0_A3@${code}`).join(',');
   const data = await jsonFetcher(url);
   return data;
}

export { fetchCountryData, fetchCountryBoundaries };
