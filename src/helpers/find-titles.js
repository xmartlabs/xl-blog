import React from "react";

const findTitles = (titles) => {
  const h1List = [];
  const h2List = [];
  const h3List = [];
  titles.forEach(title => {
    if (title.innerHTML.includes('<strong>')) {
      title.innerHTML = title.innerHTML.slice(8);
    } 
    title.setAttribute("id", title.innerHTML);

    if (title.nodeName === "H1") {
        h1List.push(title);
      }
    
    if (title.nodeName === "H2") {
        h2List.push(title);
      }

    if (title.nodeName === "H3") {
        h3List.push(title);
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
