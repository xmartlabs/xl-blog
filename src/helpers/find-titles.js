import React from "react";

const findTitles = (htmlElements) => {
  const h1List = [];
  const h2List = [];
  const h3List = [];

  htmlElements.forEach(element => {
    if(element.nodeName === "H1" || element.nodeName === "H2" || element.nodeName === "H3") {
      
      if (element.innerHTML.indexOf("<strong>") != -1) {
        element.innerHTML = element.innerHTML.slice(8);
      } 
      element.setAttribute("id", element.innerHTML);
  
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