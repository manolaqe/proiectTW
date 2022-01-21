import React from 'react'

class Project extends React.Component{
render(){
    const {item}=this.props
    this.Select = () => {
        this.props.onSelect(this.props.item.id)
    }
    return (
        <div>
            <button style={{display: 'inline',
    justifyContent: 'center',
    alignItems: 'center',
   width:'150px',
    margin:'10px',
    height: '30px',
    textAlign: 'center',
    fontSize:'10 px',
    backgroundColor: 'rgb(23, 238, 33);'}} onMouseOver="this.style.color='#cc9900'" className="butoaneProiecte" onClick={this.Select}>{item.title}</button>
        </div>
    )
}
}
export default Project