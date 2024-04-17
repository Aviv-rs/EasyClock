
const Icon = ({iconName, alt = ''}) => {
  return (
    <div className="icon_container">
        <img src={`src/assets/icons/${iconName}`} alt={alt || iconName} />
    </div>
  )
}

export default Icon