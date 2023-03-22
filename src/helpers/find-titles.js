import React from "react";

const findTitles = (titles) => {
  const h1List = [];
  const h2List = [];
  titles.map((title) => {
    if (title.nodeName === "H1") {
      title.setAttribute("id", title.innerHTML);
      h1List.push(title);
    }
    if (title.nodeName === "H2") {
      title.setAttribute("id", title.innerHTML);
      h2List.push(title);
    }
  });
  if (h1List.length !== 0) {
    return h1List;
  } else {
    if (h2List.length !== 0) {
      return h2List;
    }
  }
  return [];
};

export { findTitles };    
