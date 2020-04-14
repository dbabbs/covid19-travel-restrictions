function jsonFetcher(url) {
   return fetch(url).then((res) => res.json());
}

export default jsonFetcher;
