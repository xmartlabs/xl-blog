class AuthorSerializer {
  static deSerialize(data) {
    return {
      author: data.author,
      displayName: data.display_name,
      image: data.image,
      twitter: data.twitter,
      github: data.github,
      profileUrl: data.profile_url,
    };
  }
}

export { AuthorSerializer }
