const parser = require("@babel/parser");
const traverse = require("@babel/traverse");
const generate = require("@babel/generator");
const t = require("babel-types");

const { isUpperCase } = require("./utils");

let statesTree = {};
let setStatesTree = {};
const childrenTree = {};
let level = 0;

function autoMemo(content, map) {
  // console.log(meta);
  // 组件的子组件
  const children = [];
  // 组件的states
  const states = [];
  const setStates = [];
  const imports = [];
  const cpnImports = [];
  // console.log(map);
  console.log(this.data?.value, 'value---');
  // console.log(meta, '--');
  // console.log(content);

  // console.log(map.mappings, "normal");
  // console.log(level, "level");
  // console.log(statesTree, "state");
  // console.log(setStatesTree, 'setState');
  // console.log(childrenTree, "children");
  // console.log('--------------');
  const ast = parser.parse(content, {
    sourceType: "module",
  });
  // console.log(ast);

  traverse.default(ast, {
    ImportDeclaration(path) {
      const node = path.node;
      node.specifiers.forEach((spe) => {
        imports.push(spe.local.name);
      });
    },
    FunctionDeclaration(path) {
      const node = path.node;
      // 如果是export function 这种情况直接return
      if (path.parent?.type === "ExportNamedDeclaration") {
        return;
      }
      // 如果是内层函数，加上useCallback
      if (path.parent?.type === "BlockStatement") {
        const name = node.id?.name;
        const newNode = t.variableDeclaration("const", [
          t.variableDeclarator(
            t.identifier(name),
            t.callExpression(
              {
                type: "Identifier",
                name: "useCallback",
              },
              [
                t.functionExpression(
                  undefined,
                  node.params,
                  node.body,
                  node.generator,
                  node.async
                ),

                t.arrayExpression([]),
              ]
            )
          ),
        ]);
        path.replaceWith(newNode);
      } else {
        // 最外层函数，加上memo
        const parentStateLength = statesTree[level - 1]?.length;
        if (!parentStateLength) return;
        node.type = "FunctionExpression";
        const newNode = t.callExpression(
          {
            type: "Identifier",
            name: "memo",
          },
          [path.node]
        );
        path.replaceWith(newNode);
      }
    },
    ReturnStatement(path) {
      const { node } = path;
      const { argument } = node;
      if (argument?.type !== "CallExpression") return;
      if (
        argument.callee.type !== "MemberExpression" &&
        argument.callee.object?.name !== "React" &&
        argument.callee.property?.name !== "createElement"
      )
        return;
      const arguments = argument.arguments
      arguments.forEach((arg) => {
        if (arg.type === 'Identifier' && isUpperCase(arg.name)) {
          children.push(arg.name)
        }
        if (
          arg.type === "CallExpression" &&
          arg.callee.object?.name === "React" &&
          arg.callee.property?.name === "createElement"
        ) {
          const _args = arg.arguments;
          const { name, type } = _args[0];
          if (type === "Identifier" && isUpperCase(name)) {
            children.push(_args[0].name);
          }
        }
      });
    },
    VariableDeclaration(path) {
      const node = path.node;
      node.declarations.forEach((declarator) => {
        if (
          declarator.init.type === "CallExpression" &&
          declarator.init.callee.name === "useState"
        ) {
          if (declarator.id.type === "ArrayPattern") {
            states.push(declarator.id.elements[0].name);
            setStates.push(declarator.id.elements[1]?.name);
          }
        }
      });
    },
    CallExpression(path) {
      // console.log(path.node);
    },
  });
  const output = generate.default(ast);
  childrenTree[level] = children;
  statesTree[level] = states;
  setStatesTree[level] = setStates;
  children.length === 0 ? level : level++;

  // console.log(imports, 'normal');
  console.log(output.code, "output-------------");
  console.log(children, 'children');
  return output.code;
}
module.exports = function (content, map, meta) {
  console.log(this._module, '-----------------------');
  this.callback(null, autoMemo(content, map), map, meta)
  return 
};
// module.exports.pitch = function (...args) {
//   console.log(args, "pitch");
// };
