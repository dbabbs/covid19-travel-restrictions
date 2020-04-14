import Flag from './Flag.js';
import Pill from './Pill.js';

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

   setContent({
      code,
      country,
      classification,
      classification_id: id,
      description,
   }) {
      this.tooltip.innerHTML = `
      <div class="title-row">
         <div class="title">${country}</div>
         ${Flag(code)}
      </div>
      ${Pill(classification, id)}
      <div class="description">${description} </div>`;
   }

   setMobileContent({
      code,
      country,
      classification,
      classification_id: id,
      description,
   }) {
      this.mobileTooltip.innerHTML = `
      <div class="title-row">
         <div class="flex-align">
            ${Flag(code)}
            <div class="title">${country}</div>
         </div>
         <img src="./static/close.svg" class="close-button">
      </div>
      ${Pill(classification, id)}
      <div class="description">${description} </div>`;
      document.querySelector('.close-button').onclick = () => this.hideMobile();
   }
}

export default Tooltip;
