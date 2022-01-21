import React from 'react'

class Person extends React.Component{
render(){
    const {item}=this.props
    return (
        <div>
            <span>{item.name}, {item.group}, {item.series}</span>
        </div>
    )
}
}
export default Person