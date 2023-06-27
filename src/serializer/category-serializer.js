class CategorySerializer {
  static deSerialize(data) {
    return {
      category: data.category,
      postTitle: data.title,
      displayName: data.display_name,
      url: data.url,
      color: data.color,
    };
  }
}

export { CategorySerializer }
