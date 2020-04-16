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

const classificationLegends = [
   'Land, sea, and air borders are closed to all non-residents, except for some essential workers such as diplomats and air crew.',
   'In many cases, major airports have closed to domestic air travel and international, commercial flights suspended.',
   'Borders have been closed to certain countries and citizens deemed at higher risk of coronavirus transmission.',
];

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

function embedActive() {
   return !mobileActive() && window.innerHeight < 700;
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
   classificationLegends,
   embedActive,
};
