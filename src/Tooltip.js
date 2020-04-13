import hexToRgba from './util/hexToRgba.js';
import { colorMap } from './config.js';

const flag = (code) =>
   code.toLowerCase() === 'schengen'
      ? './static/schengen.png'
      : `https://restcountries.eu/data/${code.toLowerCase()}.svg`;

const Pill = (classification) => {
   let style = `background: ${hexToRgba(colorMap[classification], 0.2)};`;
   style += `color: ${hexToRgba(colorMap[classification], 1)};`;
   // style += `border: 1px solid ${hexToRgba(colors[color], 0.5)};`;
   return `<div class="pill" style="${style}">
      ${classification}
   </div>`;
};
class Tooltip {
   constructor() {
      this.tooltip = document.querySelector('.tooltip');
   }

   show() {
      this.tooltip.style.display = 'block';
   }

   position({ x, y }) {
      this.tooltip.style.top = y + 15;
      this.tooltip.style.left = x + 15;
   }

   hide() {
      this.tooltip.style.display = 'none';
   }

   setContent({ code, country, classification, description }) {
      const content = `
      <div class="title-row">
         <div class="title">${country}</div>
         <div class="cropper flag">
            <img src="${flag(code)}"/>
         </div>
      </div>
      ${Pill(classification)}
      <div class="description">${description} </div>`;
      this.tooltip.innerHTML = content;
   }
}

export default Tooltip;
