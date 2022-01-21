import React from 'react'
import uStyle from './css/updateProject.css'
class LivrabilAddForm extends React.Component{
    //punem ceva in stare
    constructor (props){
        super(props)
        this.state={
             link: ''
        }

        this.addLivrabil=()=>{
            this.props.onAddLivrabil({
                link: this.state.link
            })
        }
        
this.handleChange=(evt)=>{
    this.setState({
        //evt are un target=> de unde a pornit evenimentul
        //target imi permite sa accesez propr elem resp
        [evt.target.name]:evt.target.value
    })
}
    }

    render(){
        return(
      <div id='mainDivUpdateProject' style={uStyle}>
          <div id='d2' style={{marginTop:'15px',marginLeft:'15px'}}>
          <label htmlFor='link' >Link: </label>
          <input type='text' style={{backgroundColor:'#ffff66'}} name='link' id='link' value={this.state.link}
        onChange={this.handleChange}></input>
        
        </div>
          <br/>
          <input type='button' id='bAddLivrabil' value='Adauga livrabil' onClick={this.addLivrabil}></input>
      </div>
        )   
    }
}

export default LivrabilAddForm