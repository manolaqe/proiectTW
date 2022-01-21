import React from 'react'
import ipStyle from './css/initialProjects.css'
class StudentProjectList extends React.Component{
    //punem ceva in stare
    constructor (props){
        super(props)
        this.state={
        }
        this.proiecteCreare=()=>{
            this.props.onCreateProject({
            })
        }
        this.myProjects=()=>{
            this.props.onMyProjects({
            })
        }
        this.gradeProjects=()=>{
            this.props.onGradeProjects({
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
      <div id='treiButoaneDiv' style={ipStyle}>
        <input type='button' id='bNP' value='New Project' onClick={this.proiecteCreare} ></input>
        <input type='button' id='bMP' value='My projects' onClick={this.myProjects}></input>
        <input type='button' id='bGP' value='Grade projects' onClick={this.gradeProjects}></input>
      </div>
        )   
    }
}

export default StudentProjectList