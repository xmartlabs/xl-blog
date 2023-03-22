import React from "react";

const findTitles = (titles) => {
  const h1List = [];
  const h2List = [];
  const h3List = [];
  titles.map((title) => {
    if (title.nodeName === "H1") {
      if (title.innerHTML.includes('<strong>')) {
        title.innerHTML = title.innerHTML.slice(8);
        title.setAttribute("id", title.innerHTML);
        h1List.push(title);
      } else {
        title.setAttribute("id", title.innerHTML);
        h1List.push(title);
      }
    }
    if (title.nodeName === "H2") {
      if (title.innerHTML.includes('<strong>')) {
        title.innerHTML = title.innerHTML.slice(8);
        title.setAttribute("id", title.innerHTML);
        h2List.push(title);
      } else {
        title.setAttribute("id", title.innerHTML);
        h2List.push(title);
      }
    }
    if (title.nodeName === "H3") {
      if (title.innerHTML.includes('<strong>')) {
        title.innerHTML = title.innerHTML.slice(8);
        title.setAttribute("id", title.innerHTML);
        h3List.push(title);
      } else {
        title.setAttribute("id", title.innerHTML);
        h3List.push(title);
      }
    }
  });
  if (h1List.length !== 0) {
    return h1List;
  } else {
    if (h2List.length !== 0) {
      return h2List;
    } else {
      if (h3List.length !== 0) {
        return h3List;
      }
    }
  }
  return [];
};

export { findTitles };    
