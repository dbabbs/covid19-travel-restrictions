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

const colorMap = {
   'Borders closed': colors.red,
   'Flights suspended': colors.pink,
   'Borders closed to most foreigners': colors.purple,
   tbd: colors.pink,
};

const credentials = {
   id: 'gpk6hVhN',
   token: 'AFKCs6eeSxSYhpbswZsUhgA',
   apikey: 'qHbGACVC8wUgzipkERYFIvbK8ASY9UhPsKSGTB7quRI',
};

const center = {
   lat: 40,
   lng: -0,
};
const zoom = 2;
const minZoom = 1;
const maxZoom = 5;

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
];

export { colors, credentials, center, zoom, minZoom, maxZoom, colorMap };
