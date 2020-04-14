function wait(duration = globalDelay) {
   return new Promise((resolve) => {
      setTimeout(() => {
         resolve();
      }, duration);
   });
}

export default wait;
