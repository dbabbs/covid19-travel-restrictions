import Pill from './components/Pill.js';
import { mobileActive, colorMap } from './config.js';
import wait from './util/wait.js';
import Flag from './components/Flag.js';
class Sidebar {
   constructor() {
      this.mobileBackButton = document.querySelector('.back-button');

      this.mobileBackButton.onclick = () => this.setBack();

      this.addShines();
   }

   addShines() {
      for (let i = 0; i < 3; i++) {
         document
            .querySelector('.sections')
            .appendChild(this.manufactureShineSection());
      }
   }

   setForward() {
      document.querySelector(
         '.section-left'
      ).style.transform = `translateX(-100%)`;
      document.querySelector('.second-right').style.transform = `translateX(0)`;
   }

   setBack() {
      document.querySelector('.section-left').style.transform = `translateX(0)`;
      document.querySelector(
         '.section-right'
      ).style.transform = `translateX(100%)`;
   }

   async set(categories) {
      await wait(500);
      document.querySelector('.sections').innerHTML = '';
      document.querySelectorAll('.shine').forEach((node) => {
         node.classList.remove('shine');
      });
      Object.keys(categories).forEach((row) => {
         // console.log(row[categories]);
         const node = this.manufactureSection(row, categories[row]);
         document.querySelector('.sections').appendChild(node);
      });

      //set heights
      if (!mobileActive()) {
         this.calculateHeights();
      }
      // calculateHeights();
      window.onresize = () => calculateHeights();
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

   manufactureSection(category, countries) {
      if (category === undefined && countries === undefined) {
         console.log('shimmer time');
      }
      const numFlags = 3;
      const node = document.createElement('div');
      node.classList.add('section');

      // node.style.marginLeft = '3px';

      const bottom = document.createElement('div');
      bottom.classList.add('bottom');
      bottom.style.maxHeight = '0px';
      // bottom.innerHTML = `<div style="background: rgb(220, 220, 220); width: 100%; height: 1px"></div>`;
      bottom.innerHTML += countries
         .sort((a, b) => a.name.localeCompare(b.name))
         .map(
            (item, index) =>
               `<div class="country-row" style="${
                  index === 0 && `padding-top: 10px`
               }">
                  ${item.name}
                  ${Flag(item.code)}
                  
               </div>`
         )
         .join('');

      const top = document.createElement('div');
      top.classList.add('top');
      top.style.borderLeft = `4px solid ` + colorMap[category];
      top.onclick = () => {
         if (!mobileActive()) {
            console.log('hit here...');
            const curr = bottom.style.maxHeight;
            console.log(curr);
            bottom.style.maxHeight = curr === '0px' ? '500px' : 0;
         } else {
            console.log('clicking');

            document.querySelector('.second-section-content').innerHTML = ``;
            countries
               .sort((a, b) => a.name.localeCompare(b.name))
               .forEach((country) => {
                  const node = document.createElement('div');
                  node.classList.add('country-row');
                  node.innerHTML = `
                  ${country.name}
                  ${Flag(country.code)}
               `;
                  document
                     .querySelector('.second-section-content')
                     .appendChild(node);
               });

            setForward();
         }
      };
      top.innerHTML = `
      <div class="top-inner">
      <div>
      <div>${Pill(category)}</div>
      <div class="small">${countries.length} ${
         countries.length > 1 ? 'countries' : 'country'
      }</div>
   </div>
   <div class="flag-section">
      ${countries
         .sort((a, b) => a.name.localeCompare(b.name))
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
      node.appendChild(top);

      node.appendChild(bottom);

      return node;
   }

   calculateHeights() {
      const height = document.querySelector('.sections').offsetHeight;
      const sectionHeightSum = [...document.querySelectorAll('.section')]
         .map((x) => x.offsetHeight)
         .reduce((curr, total) => curr + total);
      console.log(sectionHeightSum);

      const bottoms = document.querySelectorAll('.bottom');
      bottoms.forEach((b) => {
         b.style.height = height - sectionHeightSum;
         console.log(b.style.height);
      });

      document.querySelector('.sections').style.height = sectionHeightSum;
   }
}

export default Sidebar;
