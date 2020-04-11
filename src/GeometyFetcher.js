const credentials = {
   id: 'gpk6hVhN',
   token: 'AFKCs6eeSxSYhpbswZsUhgA',
};

const base = `https://xyz.api.here.com/hub/spaces/${credentials.id}/search?access_token=${credentials.token}`;

/**
 * USA needs a custom override value because it is so large and counding box stretches entire
 * globe due to islands and Alaska
 */
const usaBbox = [-124.804, 26.745, -70.664, 47.989];

class GeometryFetcher {
   constructor() {
      this.data = {};

      // const initialCountries = ['USA', 'DEU', 'FRA', 'ESP', 'ITA'];
      // this.requestMultiple('country', initialCountries);
   }

   async request(code) {
      const tags = `&tags=ADM0_A3@${code}`;
      const url = base + tags;
      const data = await fetch(url).then((res) => res.json());
      const shape = data.features[0];
      this.data[code] = shape;
   }

   async requestMultiple(codes) {
      const url = base + codes.map((code) => `&tags=ADM0_A3@${code}`).join(',');

      const data = await fetch(url).then((res) => res.json());
      codes.forEach((code) => {
         const match = data.features.find(
            (x) => x.properties['ADM0_A3'] === code
         );
         this.data[code] = match;
      });
   }

   async retrieve(code) {
      if (this.data.hasOwnProperty(code)) {
         return this.data[code];
      }
      await this.request(code);
      return this.data[code];
   }
   retrieveAll(type) {
      return Object.keys(this.data).map((key) => ({
         code: key,
         ...this.data[key],
      }));
   }
}

const util = new GeometryFetcher();
export default util;
