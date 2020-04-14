import { credentials } from '../config.js';
async function fetchCountryData() {
   const url = `https://spreadsheets.google.com/feeds/cells/1ayVxennSpqejr3aytsQLn4b0tyOEW6wmGsOdhjPr3yA/1/public/full?alt=json`;
   const data = await fetch(url).then((res) => res.json());
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
   return output;
}

async function fetchCountryBoundaries(codes) {
   const base = `https://xyz.api.here.com/hub/spaces/${credentials.id}/search?access_token=${credentials.token}`;
   const url = base + codes.map((code) => `&tags=ADM0_A3@${code}`).join(',');
   const data = await fetch(url).then((res) => res.json());
   return data;
}

export { fetchCountryData, fetchCountryBoundaries };
