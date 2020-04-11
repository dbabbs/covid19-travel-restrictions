import hexToRgba from './util/hexToRgba.js';
import { colors } from './config.js';

const flag = (code) => {
   return code === 'schengen'
      ? './static/schengen.png'
      : `https://restcountries.eu/data/${code.toLowerCase()}.svg`;
};
const Pill = (color) => {
   let style = `background: ${hexToRgba(colors[color], 0.2)};`;
   style += `color: ${hexToRgba(colors[color], 1)};`;
   return `<div class="pill" style="${style}">
      Flights suspended
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

   setContent({ code }) {
      const content = `
      <div class="title-row">
         <div class="title">Schengen Zone</div>
         <img class="flag" src="${flag(code)}"/>
      </div>
      ${Pill('red')}
      <div class="description">
         On March 27th, the European Commission banned all internation flights for at least 30 days.
      </div>`;
      this.tooltip.innerHTML = content;
   }
}

export default Tooltip;
