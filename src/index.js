import TreeWalker from 'npm-tree-walker'

export default (pkgRoot, options) => new Promise((resolve, reject) => {
  const result = { root: null, packages: {} }
  const walker = new TreeWalker(pkgRoot, options)
  walker.on('data', (pkg) => {
    if (pkg.parent != null) {
      const key = `${pkg.name}@${pkg.version}`
      if (result.packages[key] == null) {
        result.packages[key] = pkg
        pkg.dependencies = {}
      }
      const parentKey = `${pkg.parent.name}@${pkg.parent.version}`
      const parent = result.packages[parentKey] || result.root
      parent.dependencies[pkg.name] = pkg.version
    } else {
      pkg.dependencies = {}
      result.root = pkg
    }
  })
  walker.once('end', () => {
    resolve(result)
  })
  walker.once('error', (err) => {
    reject(err)
  })
  walker.run()
})
