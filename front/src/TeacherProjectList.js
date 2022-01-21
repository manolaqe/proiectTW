import React from 'react'

class StudentProjectList extends React.Component{
    //punem ceva in stare
    constructor (props){
        super(props)
        this.state={
        }
    }

    render(){
        return(
      <div >
          <input className='bCute' type='button' value='Projects' ></input>
      </div>
        )   
    }
}

export default StudentProjectList