import './index.css'

const Skills = props => {
  const {skillDetails} = props

  const {name, imageUrl} = skillDetails

  return (
    <div className="skill-container">
      <img src={imageUrl} alt={name} />
      <p className="skill-name">{name}</p>
    </div>
  )
}

export default Skills
