import React from "react";

const actualCategory = (isLayout, filters) => {  
  if (typeof window !== 'undefined') {
    if (window.location.pathname === '/') {
      return isLayout ? 'all' : '';
    }

    return filters.find(({ name }) => window.location.href.includes(name))?.name;
  }
  return isLayout ? 'all' : ''; 
};

export { actualCategory };
