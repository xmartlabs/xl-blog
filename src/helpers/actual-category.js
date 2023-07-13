import React from "react";

const actualCategory = (isLayout) => {
  const filters = [
    {name: "all"},
    {name: "development"},
    {name: "product-design"},
    {name: "machine-learning"},
    {name: "blockchain"},
    {name: "people-events"},
  ];
  
  if (typeof window !== 'undefined') {
    if (window.location.pathname === '/') {
      return isLayout ? 'all' : '';
    }

    return filters.find(({ name }) => window.location.href.includes(name))?.name;
  }
  return isLayout ? 'all' : ''; 
};

export { actualCategory };
