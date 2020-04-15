function getUrl(code) {
   return code.toLowerCase() === 'schengen'
      ? './static/flags/schengen.png'
      : `https://restcountries.eu/data/${code.toLowerCase()}.svg`;
}

const Flag = (code, style = {}) => {
   const styleString = `style="${Object.keys(style)
      .map((key) => `${key}: ${style[key]};`)
      .join('')}"`;
   return `
   <div ${styleString} class="cropper ${code === null && 'shine'}">
      ${
         code === null
            ? `<div class="shine-img"></div>`
            : `<img src="${getUrl(code)}" />`
      }
   </div>`;
};

export default Flag;
