import styles from './App.module.css'
import Dropdown, {DropdownOption} from "./components/Dropdown/Dropdown.tsx";
import {useState} from "react";
import PlaygroundOption from "./components/PlaygroundOption/PlaygroundOption.tsx";
import {Outlet} from "react-router-dom";

function App() {
  const [curPlayground, setCurPlayground] = useState("transformmatrices")

  const playgroundOptions: DropdownOption[] = [
    {
      label: "Transformation Matrices",
      id: "transformmatrices",
      node: <PlaygroundOption
        label="Transform Matrices"
        img="playgrounds/transformmatrices.svg"
        description="Mess around with transform matrices - an elegant way of moving, rotating, and scaling vectors. Essential for displaying 3D graphics on screens."
      />
    },
    {
      label: "Vectors",
      id: "vectors",
      node: <PlaygroundOption
        label="Vectors"
        img="playgrounds/vectors.svg"
        description="Mess around with transform matrices - an elegant way of moving, rotating, and scaling vectors. Essential for displaying 3D graphics on screens."
      />
    },
    {
      label: "Perspective Matrices",
      id: "perspectivematrices",
      node: <PlaygroundOption
        label="Perspective Matrices"
        img="playgrounds/perspective.svg"
        description="Mess around with transform matrices - an elegant way of moving, rotating, and scaling vectors. Essential for displaying 3D graphics on screens."
      />
    }
  ]

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <h1>playground</h1>
        <Dropdown options={playgroundOptions} onChange={setCurPlayground} />
      </div>
      <Outlet />
    </div>
  )
}

export default App
