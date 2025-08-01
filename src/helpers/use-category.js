import CategoriesYAMLDATA from '../../content/categories.yaml';
import { CategorySerializer } from '../serializer';

const useCategory = (data) => {
  const category = CategoriesYAMLDATA.find(({ category }) => category === data);
  return CategorySerializer.deSerialize(category);
};

export { useCategory };
