import React, {Component} from 'react'
import { AuthConsumer } from '../context/auth.context'
import { Link } from 'react-router-dom'

class Menu extends Component{

    render(){
        return (
            <AuthConsumer>
                {({token, user, logout})=>(
                    token ? 
                        <button onClick={logout}>Log out</button> :
                        <Link to="/login">Log in</Link>
                )}
            </AuthConsumer>
        )
    }
}
export default Menu