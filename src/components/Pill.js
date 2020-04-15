import hexToRgba from '../util/hexToRgba.js';
import { colorMap } from '../config.js';
const Pill = (classification, id) => {
   let style = `background: ${hexToRgba(colorMap[id], 0.2)};`;
   style += `color: ${hexToRgba(colorMap[id], 1)};`;
   return `<div class="pill" style="${style}">
      ${classification}
   </div>`;
};
export default Pill;
