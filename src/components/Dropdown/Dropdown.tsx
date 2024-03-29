import styles from './Dropdown.module.css'
import clsx from "clsx";
import {FormEvent, ReactNode, useId, useState} from "react";

export type DropdownOption = {
  label: string,
  id: string,
  node: ReactNode,
}

type DropdownProps = {
  options: DropdownOption[],
  onChange: (id: string) => void,
}

export default function Dropdown({ options, onChange }: DropdownProps) {
  const [curOption, setCurOption] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const popupId = useId()

  const handleOpen = () => {
    setOpen(!open)
  }

  const handleSelection = (e: FormEvent<HTMLButtonElement>, option: string) => {
    e.preventDefault()
    setCurOption(option)
    onChange(option)
    setOpen(false)
  }

  return (
    <div className={styles.container}>
      <button
        className={clsx({
          [styles.dropdown]: !open,
          [styles.dropdownOpen]: open,
        })}
        type="button"
        onClick={handleOpen}
        role="combobox"
        aria-controls={popupId}
        aria-expanded={open}
      >
        {/* Currently selected option */}
        {options.find((option) => option.id === curOption)?.label
          || <i className={styles.noneText}>Select an option</i>}
        <img src="/down-arrow.svg" alt="" />
      </button>

      {/* Render Options */}
      {open &&
        <div className={styles.options} id={popupId} role="listbox">
          {options.map((option) => (
            <button
              className={styles.option}
              onClick={(e) => handleSelection(e, option.id)}
              key={option.id}
              type="button"
              role="option"
              aria-selected={curOption === option.id}
            >
              {option.node}
            </button>
          ))}
        </div>
      }
    </div>
  )
}
