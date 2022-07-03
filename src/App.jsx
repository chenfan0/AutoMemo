import React, {memo, useState, useCallback} from 'react'
import Cpn2 from './Cpn2.jsx';
import Cpn from './Cpn1.jsx'
// import Cpn3 from './Cpn3.jsx';
// import Cpn4 from './Cpn4.jsx';

export default function App(A, b, c) {
  const [count, setCount] = useState(0)
  const [a, setA] = useState('a')
  function change() {
    console.log('change');
  }
  function abc() {

  }
  console.log('app render')
  return <>
    <h1>App: {count}</h1>
    <button onClick={e => setCount(count + 1)}> +1 </button>
    <Cpn2 />
    <Cpn change={change}><div>{count}</div></Cpn>
  </>
}