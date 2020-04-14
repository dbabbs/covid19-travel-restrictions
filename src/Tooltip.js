import hexToRgba from './util/hexToRgba.js';
import { colorMap } from './config.js';
import flag from './util/flag.js';

const Pill = (classification) => {
   let style = `background: ${hexToRgba(colorMap[classification], 0.2)};`;
   style += `color: ${hexToRgba(colorMap[classification], 1)};`;
   return `<div class="pill" style="${style}">
      ${classification}
   </div>`;
};

class Tooltip {
   constructor() {
      this.tooltip = document.querySelector('.desktop-tooltip');
      this.mobileTooltip = document.querySelector('.mobile-tooltip');
   }

   showMobile() {
      this.mobileTooltip.style.transform = `translateY(0)`;
   }
   hideMobile() {
      this.mobileTooltip.style.transform = `translateY(-150%)`;
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

   setMobileContent({ code, country, classification, description }) {
      const content = `
      <div class="title-row">
         <div class="flex-align">
            <div class="cropper flag" style="margin-right: 5px">
               <img src="${flag(code)}"/>
            </div>
            <div class="title">${country}</div>
         </div>
         <img src="./static/close.svg" class="close-button">
      </div>
      ${Pill(classification)}
      <div class="description">${description} </div>`;
      this.mobileTooltip.innerHTML = content;
      document.querySelector('.close-button').onclick = () => this.hideMobile();
   }
}

export default Tooltip;
