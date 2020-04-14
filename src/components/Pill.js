import hexToRgba from '../util/hexToRgba.js';
import { colorMap } from '../config.js';
const Pill = (classification) => {
   let style = `background: ${hexToRgba(colorMap[classification], 0.2)};`;
   style += `color: ${hexToRgba(colorMap[classification], 1)};`;
   return `<div class="pill" style="${style}">
      ${classification}
   </div>`;
};
export default Pill;
