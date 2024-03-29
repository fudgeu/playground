import styles from './PlaygroundOption.module.css'

type PlaygroundOptionProps = {
  img: string,
  label: string,
  description: string,
}

export default function PlaygroundOption({ img, label, description }: PlaygroundOptionProps) {
  return (
    <div className={styles.container}>
      <img src={img} alt="" />
      <div className={styles.description}>
        <h2>{label}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}
