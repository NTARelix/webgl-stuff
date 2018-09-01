const path = require('path')

const paths = {}
paths.root = __dirname
paths.src = path.resolve(paths.root, 'src')
paths.nodeModules = path.resolve(paths.root, 'node_modules')
paths.pixiDist = path.resolve(paths.nodeModules, 'pixi.js/dist/pixi.min.js')
paths.entry = path.resolve(paths.src, 'entry.js')
paths.demoHtml = path.resolve(paths.src, 'index.html')
paths.dist = path.resolve(paths.root, 'dist')

module.exports = paths
