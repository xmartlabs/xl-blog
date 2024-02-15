const findTitles = (htmlElements) => {
  const h1List = [];
  const h2List = [];
  const h3List = [];

  htmlElements.forEach(element => {
    if(element.nodeName === "H1" || element.nodeName === "H2" || element.nodeName === "H3") {
      
      element.setAttribute("id", element.innerText);
  
      if (element.nodeName === "H1") {
        h1List.push(element);
      }
      
      if (element.nodeName === "H2") {
        h2List.push(element);
      }
  
      if (element.nodeName === "H3") {
        h3List.push(element);
      }
    }
  });
  
  if (h1List.length !== 0) {
    return h1List;
  }
  if (h2List.length !== 0) {
    return h2List;
  }
  return h3List;
};

export { findTitles };    
