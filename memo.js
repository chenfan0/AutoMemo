const fs = require('fs')

const parser = require('@babel/parser')
const traverse = require('@babel/traverse')
const generate = require('@babel/generator')
const t = require('babel-types')
// const esbuild = require('esbuild')

// const code = fs.readFileSync('./src/App.jsx', {encoding: 'utf-8'})

// // hasProp()
// const jsx = require("@babel/core").transformSync(code, {
//   plugins: ["@babel/plugin-transform-react-jsx"],
// }).code;
module.exports = function (content) {
  const ast = parser.parse(content, {
    sourceType: 'module'
  })
  
  traverse.default(ast, {
    FunctionDeclaration(path) {
      const node = path.node
      if (path.parent?.type === 'ExportNamedDeclaration' || path.parent.type === 'BlockStatement') {
        return
      }
      node.type = 'FunctionExpression'
      const newNode = t.callExpression({
        type: 'Identifier',
        name: 'memo'
      }, [path.node])
      path.replaceWith(newNode)
    },
    CallExpression({node}) {
    }
  })
  const output = generate.default(ast)
  // console.log(jsx);
  // console.log(ast);
  
  // console.log(ast);
  console.log(output.code, 'output-------------');
  
  // console.log(code);
  // return output.code
 return content
}
