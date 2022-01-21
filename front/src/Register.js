import React from 'react'
import registerCSS from './css/register.css'
class Register extends React.Component{
    //punem ceva in stare
    constructor (props){
        super(props)
        this.state={
            type:'STUDENT',
            name: '',
            group: '1',
            series: 'A',
            username: '',
            password: '',
            disabled:false
        }

        this.add=()=>{
            this.props.onAdd({
                type: this.state.type,
                name: this.state.name,
                group: this.state.group,
                series: this.state.series,
                username: this.state.username,
                password: this.state.password
            })
        }
        this.cancel=()=>{
            this.props.onCancel({
            })
        }
    
this.handleChange=(evt)=>{
    this.setState({
        //evt are un target=> de unde a pornit evenimentul
        //target imi permite sa accesez propr elem resp
        [evt.target.name]:evt.target.value
       
    })
    if (evt.target.name==='type' && evt.target.value==='TEACHER'){
           this.state.disabled=true;
    }
    if (evt.target.name==='type' && evt.target.value==='STUDENT'){
        this.state.disabled=false;
}

}
    }

    render(){
        return(
      <div id='registerDiv' style={{registerCSS}}>
          <div className='interface'>
          <div>
         <label htmlFor='username' className='label' >Username: </label>
          <input type='text' className='field' name='username' id='username' value={this.state.username}
           onChange={this.handleChange}></input>
         </div>
         <br/>
         <div>
         <label htmlFor='password' className='label'>Password: </label>
          <input type='password' className='field' name='password' id='password' value={this.state.password}
           onChange={this.handleChange}></input>
         </div>
        <br/>
        <div>
        <label htmlFor='status' className='label' >Type: </label>
          <select id='type' className='field' value={this.state.status} name='type' onChange={this.handleChange} >
                    <option value="STUDENT">STUDENT</option>
                    <option value="TEACHER">TEACHER</option>
                    
        </select>
       </div>
        <br/>
        <div>
        <label className='label' htmlFor='name'>Name: </label>
          <input type='text'   className='field' name='name' id='name' value={this.state.name}
           onChange={this.handleChange}></input>
        </div>
       
        <br/>
        <div>
        <label className='label' htmlFor='group'>Group: </label>
          <select id='group' className='field' value={this.state.class} name='group' onChange={this.handleChange} disabled={this.state.disabled} >
                    <option value="1">Grupa 1</option>
                    <option value="2">Grupa 2</option>
                    <option value="3">Grupa 3</option>
                    <option value="4">Grupa 4</option>
        </select>
        </div>
         <br/>
         <div>
         <label className='label' htmlFor='series'>Series: </label>
          <select   id='series' className='field' value={this.state.series} name='series' onChange={this.handleChange} disabled={this.state.disabled} >
                    <option value="A">Seria A</option>
                    <option value="B">Seria B</option>
                    <option value="C">Seria C</option>
                    <option value="D">Seria D</option>
        </select>
         </div>
        
         </div>
          <br/>
          <div>
          <input id='bAdd' type='button' value='Add' onClick={this.add}></input>
            <input id='bCancel' type='button' value='Cancel' onClick={this.cancel}></input>
          </div>
            
      </div>
        )   
    }
}

export default Register