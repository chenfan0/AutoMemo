import React, {memo, useState} from 'react'
import Cpn from './App1.jsx'

export default function App(a, b, c) {
  const [count, setCount] = useState(0)
  console.log('app render')
  return <>
    <h1>App: {count}</h1>
    <button onClick={e => setCount(count + 1)}> +1 </button>
    <Cpn/>
  </>
}