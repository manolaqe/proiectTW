import React from 'react'
import loginCSS from './css/login.css'
class Login extends React.Component{
    //punem ceva in stare
    constructor (props){
        super(props)
        this.state={
            username: '',
            password: ''
        }

        this.logIn=()=>{
        
            this.props.onLog({
                username: this.state.username,
                password: this.state.password
            })
        }
        this.signIn=()=>{
          
            this.props.onSign({
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
      <div id='userLogin' style={loginCSS}>

          <div className='interface'>
          <label htmlFor='username' className='labelPersonLogin'>Username</label>

          <input type='text' className='tbPersonLogin' name='username' id='username' value={this.state.username}
           onChange={this.handleChange}></input>
          
         <label htmlFor='password' className='labelPersonLogin'>Password</label>

          <input type='password' className='tbPersonLogin' name='password' id='password' value={this.state.password}
           onChange={this.handleChange}></input>
            </div>
          <input type='button' id='bl1' value='Log in' onClick={this.logIn}></input>

          <input type='button' id='bl2' value='Register' onClick={this.signIn}></input>
          
            
      </div>
        )   
    }
}

export default Login