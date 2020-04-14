function flag(code) {
   return code.toLowerCase() === 'schengen'
      ? './static/schengen.png'
      : `https://restcountries.eu/data/${code.toLowerCase()}.svg`;
}

export default flag;
