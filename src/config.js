//500
const colors = {
   pink: '#D53F8C',
   purple: '#805AD5',
   blue: '#3182CE',
   teal: '#319795',
   gray: '#718096',
   green: '#38A169',
   red: '#E53E3E',
};

const colorMap = ['#000', colors.red, colors.teal, colors.purple];

const credentials = {
   id: 'gpk6hVhN',
   token: 'AFKCs6eeSxSYhpbswZsUhgA',
   apikey: 'qHbGACVC8wUgzipkERYFIvbK8ASY9UhPsKSGTB7quRI',
};

const center = {
   lat: 40,
   lng: -0,
};
const zoom = 1;
const minZoom = 1;
const maxZoom = 4;

function mobileActive() {
   const mobileWidth = 420;
   return window.innerWidth <= mobileWidth;
}

export {
   colors,
   credentials,
   center,
   zoom,
   minZoom,
   maxZoom,
   colorMap,
   mobileActive,
};
