import {
   credentials,
   center,
   zoom,
   minZoom,
   maxZoom,
   mobileActive,
} from '../config.js';
import constructMapPolygon from '../util/constructMapPolygon.js';
class Map {
   constructor(tooltip) {
      const platform = new H.service.Platform({ apikey: credentials.apikey });
      const defaultLayers = platform.createDefaultLayers();
      this.map = new H.Map(
         document.querySelector('.map'),
         defaultLayers.vector.normal.map,
         {
            center,
            zoom,
            pixelRatio: window.devicePixelRatio || 1,
         }
      );
      window.addEventListener('resize', () => this.map.getViewPort().resize());
      new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
      const provider = this.map.getBaseLayer().getProvider();
      const style = new H.map.Style('../static/map-style/scene.yaml');
      provider.setStyle(style);

      defaultLayers.vector.normal.map.setMax(maxZoom);
      defaultLayers.vector.normal.map.setMin(minZoom);

      this.tooltip = tooltip;
   }

   async addObject(feature) {
      const object = await constructMapPolygon(feature);

      object.addEventListener('pointerenter', (evt) => {
         if (!mobileActive()) {
            const { clientX: x, clientY: y } = evt.originalEvent;
            this.tooltip.show();
            this.tooltip.position({ x, y });
            this.tooltip.setContent(feature.properties);
         }
      });

      object.addEventListener('pointermove', (evt) => {
         if (!mobileActive()) {
            const { clientX: x, clientY: y } = evt.originalEvent;
            this.tooltip.position({ x, y });
         }
      });

      object.addEventListener('pointerleave', () => {
         if (!mobileActive()) {
            this.tooltip.hide();
         }
      });

      object.addEventListener('tap', () => {
         if (mobileActive()) {
            this.tooltip.showMobile();
            this.tooltip.setMobileContent(feature.properties);
         }
      });

      this.map.addObject(object);
   }
}

export default Map;
