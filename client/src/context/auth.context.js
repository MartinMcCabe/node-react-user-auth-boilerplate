import React, {Component} from 'react'
import Message from '../components/message'
import { doFetch } from './utils'

const AuthContext = React.createContext()

class AuthProvider extends Component{

    state = {
        user: null,
        token: null,
        resetLink: null,
        message: null,
    }

    constructor () {
        super()
        this.register = this.register.bind(this)
        this.logout = this.logout.bind(this)
        this.login = this.login.bind(this)
        this.forgotPassword = this.forgotPassword.bind(this)
        this.resetPassword = this.resetPassword.bind(this)
    }

    componentDidMount() {

        // log in saved (localstorae) user
        const savedUser = localStorage.getItem('user')
        if(savedUser) {
            const {user, token} = JSON.parse(savedUser)
            this.setState({
                user,
                token
            })
        }
    }

    /**
     * register new user
     */
    async register(name, email, password, confirmPassword){

        if(password !== confirmPassword){
            // TODO add toast message
            console.error('Passwords don\' match')
            return
        }

        const q = {
            query: `mutation{
                createUser(name:"${name}", email:"${email}", password:"${password}", confirmPassword:"${confirmPassword}") {
                    token,
                    user {
                        name,
                        email,
                        id,
                        gravatar
                    }
                }
            }`
        }

        const result = await doFetch(q)
        if(!result.errors){
            const {user, token} = result.data.createUser
            this.setState({
                user,
                token
            })
            
            this.keepUserLoggedin(user, token)
        }else{
            this.setState({
                message: result.errors[0].message
            })
        }
    }

    /**
     * save user and token to local storage to keep them logged in
     */
    keepUserLoggedin(user, token) {
        const localUser = {user, token}
        localStorage.setItem('user', JSON.stringify(localUser))
    }

    /**
     * log in existing user, save token in local storage
     */
    async login(email, password) {

        const q = {
            query: `mutation {
                loginUser(email:"${email}", password:"${password}"){
                    token,
                    user{
                        name,
                        email,
                        id,
                        gravatar
                    }
                }
            }
        `}

        const result = await doFetch(q)
        if(!result.errors){
            const {user, token} = result.data.loginUser
            this.setState({
                user,
                token
            })
            
            this.keepUserLoggedin(user, token)
        }else{
            this.setState({
                message: result.errors[0].message
            })
        }
    }

    /**
     * log out current user and delete localstorage
     */
    logout() {
        this.setState({
            user: null,
            token: null,
            message: 'You have been logged out.'
        })
        localStorage.removeItem('user')
    }

    async forgotPassword(email) {
        const q = {
            query: `mutation {
                forgotPassword(email:"${email}"){
                    message
                }
            }
        `}

        const result = await doFetch(q)
        if(!result.errors){
            const {message} = result.data.forgotPassword
            // TODO: display message to user
            this.setState({
                resetLink: true,
                message
            })
            setTimeout(()=>{
                this.setState({
                    resetLink: false
                })
            }, 2000)
        }else{
            this.setState({
                message: result.errors[0].message
            })
        }
    }

    async resetPassword(email, password, resetToken) {
        const q = {
            query: `mutation {
                resetPassword(email:"${email}", password:"${password}", confirmPassword:"${password}", resetPasswordToken:"${resetToken}"){
                    token,
                    user{
                        name,
                        email,
                        id,
                        gravatar
                    }
                }
            }
        `}

        const result = await doFetch(q)
        if(!result.errors){
            const {user, token} = result.data.resetPassword
            this.setState({
                user,
                token,
                message: 'Your password has been changed.'
            })
            
            this.keepUserLoggedin(user, token)
        }else{
            this.setState({
                message: result.errors[0].message
            })
        }
    }
    
    render(){
        return (
            <AuthContext.Provider
                value={{
                    user: this.state.user,
                    token: this.state.token,
                    register: this.register,
                    logout: this.logout,
                    login: this.login,
                    forgotPassword: this.forgotPassword,
                    resetLink: this.state.resetLink,
                    resetPassword: this.resetPassword
                }} >

                {this.props.children}
                
                <Message 
                    message={<span>{this.state.message}</span>} 
                    open={this.state.message !== null} 
                    handleClose={()=>{this.setState({message: null})}} 
                    autoHideDuration={5000} />
            </AuthContext.Provider>
        )
    }
}

const AuthConsumer = AuthContext.Consumer

export {AuthProvider, AuthConsumer}