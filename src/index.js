import TreeWalker from 'npm-tree-walker'

export default (pkgRoot, options) => new Promise((resolve, reject) => {
  const result = { root: null, packages: {} }
  const walker = new TreeWalker(pkgRoot, options)
  walker.on('data', (pkg) => {
    pkg.dependencies = {}
    if (pkg.parent != null) {
      const key = `${pkg.name}@${pkg.version}`
      result.packages[key] = pkg
      pkg.parent.dependencies[pkg.name] = pkg.version
    } else {
      result.root = pkg
    }
  })
  walker.once('end', () => resolve(result))
  walker.once('error', (err) => reject(err))
  walker.run()
})
