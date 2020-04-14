function purgeChildren(node) {
   [...node.children].forEach((child) => {
      child.remove();
   });
}
export default purgeChildren;
