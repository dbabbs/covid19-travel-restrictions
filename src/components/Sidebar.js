import Pill from './Pill.js';
import {
   mobileActive,
   embedActive,
   colorMap,
   classificationLegends,
} from '../config.js';
import wait from '../util/wait.js';
import Flag from './Flag.js';
import purgeChildren from '../util/purgeChildren.js';
class Sidebar {
   constructor() {
      this.mobileBackButton = document.querySelector('.back-button');
      this.container = document.querySelector('.sections');
      this.leftSection = document.querySelector('.left-section');
      this.rightSection = document.querySelector('.right-section');
      this.rightSectionContent = document.querySelector(
         '.right-section-content'
      );
      this.mobileBackButton.onclick = () => this.setBack();

      this.addShines();
   }

   addShines() {
      for (let i = 0; i < 3; i++) {
         this.leftSection.appendChild(
            this.manufactureShineSection(undefined, undefined)
         );
      }
   }

   setForward() {
      this.leftSection.style.transform = `translateX(-100%)`;
      this.rightSection.style.transform = `translateX(0)`;
   }

   setBack() {
      this.leftSection.style.transform = `translateX(0)`;
      this.rightSection.style.transform = `translateX(100%)`;
   }

   async setContent(data) {
      const classifications = [...new Set(data.map((x) => x.classification))];
      await wait(500);
      purgeChildren(this.leftSection);
      document.querySelectorAll('.shine').forEach((node) => {
         node.classList.remove('shine');
      });

      classifications.forEach((classification, index) => {
         const matches = data.filter(
            (x) => x.classification === classification
         );
         const node = this.manufactureSection(matches, index);
         this.leftSection.appendChild(node);
      });

      this.calculateHeights();
      window.onresize = () => this.calculateHeights();
   }

   calculateHeights() {
      console.log('resizing..');
      if (mobileActive()) {
         const sectionHeightTotals = [...document.querySelectorAll('.section')]
            .map((x) => x.offsetHeight)
            .reduce((x, y) => x + y);
         console.log(sectionHeightTotals);

         document.querySelector('.sections').style.height = sectionHeightTotals;
      } else {
         document.querySelector('.sections').style.height = '100%';
      }
   }

   setRightSectionContent(countries) {
      console.log(countries);
      purgeChildren(this.rightSectionContent);
      countries
         .sort((a, b) => a.country.localeCompare(b.country))
         .forEach((country) => {
            const node = document.createElement('div');
            node.classList.add('country-row');
            node.innerHTML = `
                  ${country.country}
                  ${Flag(country.code)}
               `;
            this.rightSectionContent.appendChild(node);
         });
      document.querySelector('.title-row .center').innerHTML = Pill(
         countries[0].classification,
         countries[0].classification_id
      );
   }

   manufactureShineSection() {
      const node = document.createElement('div');
      node.classList.add('section');
      node.style.borderLeft = `4px solid transparent`;
      const numFlags = 3;
      node.innerHTML = `
         <div class="top top-inner">
            <div>
               <div style="width: 200px" class="shine">${Pill(
                  'Borders closed'
               )}</div>
               <div style="width: 100px" class="small shine">asdfadsf</div>
            </div>
            <div class="flag-section">
               ${Array(numFlags)
                  .fill(0)
                  .map((x, index) =>
                     Flag(null, {
                        position: 'absolute',
                        transform: `translateX(${
                           (numFlags - 1 - index) * 12
                        }px)`,
                     })
                  )
                  .join('')}      
            </div>
         </div>`;
      return node;
   }

   manufactureSection(countries, index) {
      const { classification, classification_id: id } = countries[0];
      const numFlags = 3;
      const node = document.createElement('div');
      node.classList.add('section');
      node.style.borderLeft = `4px solid ` + colorMap[id];
      node.onclick = () => {
         this.setRightSectionContent(countries);
         this.setForward();
      };
      node.innerHTML = `
      <div class="top-inner">
      <div style="flex: 1;">
      <div>${Pill(classification, id)}</div>
      <div style="flex: 1" class="small">${countries.length} ${
         countries.length > 1 ? 'countries' : 'country'
      }</div>
      <div class="section-label">${classificationLegends[id - 1]}</div>
   </div>
   <div class="flag-section">
      ${countries
         .sort((a, b) => a.country.localeCompare(b.country))
         .slice(0, numFlags)
         .reverse()
         .map((item, index) =>
            Flag(item.code, {
               position: 'absolute',
               transform: `translateX(${(numFlags - 1 - index) * 12}px)`,
            })
         )
         .join('')}
   </div>
      </div>
      `;

      return node;
   }
}

export default Sidebar;
