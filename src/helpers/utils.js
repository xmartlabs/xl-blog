function classnames(...args) {
  if (args.length === 1) {
    const [firstEntry] = args;
    if (firstEntry && typeof firstEntry === 'object') {
      const activeClasses = Object.entries(firstEntry)
        .filter(([, value]) => value)
        .map(([key]) => key);
      return activeClasses.join(' ');
    }
    return firstEntry;
  }
  return args
    .filter((entry) => !!entry)
    .map((value) => classnames(value))
    .join(' ');
}

export { classnames };
