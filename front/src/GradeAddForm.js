import React from 'react'
import gStyle from './css/grade.css'
class GradeAddForm extends React.Component{
    //punem ceva in stare
    constructor (props){
        super(props)
        this.state={
            grade: 1
        }
        this.addGrade=()=>{
            this.props.onAddGrade({
                grade: this.state.grade
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
      <div id='mainDivGrade' style={gStyle}>
          <div>
          <label className htmlFor='grade'>Nota: </label>
          <input type='text' name='grade' id='grade' value={this.state.grade}
        onChange={this.handleChange}></input></div>
          <br/>
          <input type='button' id='bNota' value='Add Grade' onClick={this.addGrade}></input>
      </div>
        )   
    }
}

export default GradeAddForm