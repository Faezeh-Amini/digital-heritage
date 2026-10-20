window.imageUtils = {
  normalize: function(path) {
    if (!path) return path;
    var p = path.trim();
    if (!p.startsWith('/')) {
      p = '/' + p.replace(/^\.\//, '').replace(/^\.\.\//, '').replace(/\\/g, '/');
    }
    return p;
  }
};
