const hexToRgba = (hex, alpha = 1) => {
   if (hex === undefined) {
      return undefined;
   }
   const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
   return `rgba(${r},${g},${b},${alpha})`;
};

export default hexToRgba;
