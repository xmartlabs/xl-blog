class CategorySerializer {
  static deSerialize(data) {
    return {
      category: data.category,
      displayName: data.display_name,
    };
  }
}

export { CategorySerializer };
