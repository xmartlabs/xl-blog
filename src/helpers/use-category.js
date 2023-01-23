import React from "react";

import CategoriesYAMLDATA from "../../content/categories.yaml";
import { CategorySerializer } from '../serializer';

const useCategory = (data) => {
  const category = CategoriesYAMLDATA.find(({ category }) => (category === data));
  const categoryBlog = CategorySerializer.deSerialize(category);
  return categoryBlog;
};

export { useCategory };
