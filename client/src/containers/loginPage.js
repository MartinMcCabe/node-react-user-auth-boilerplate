import React, {Component} from 'react'
import { AuthConsumer } from '../context/auth.context'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import LockIcon from '@material-ui/icons/LockOutlined'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import { Redirect } from 'react-router-dom'

const styles = theme => ({
    layout: {
        width: 'auto',
        display: 'block', // Fix IE11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
})

class LoginPage extends Component{
    state={
        email: null,
        password: null,
    }

    onEmailChange(e) {
        this.setState({
            email: e.target.value
        })
    }
    
    onPasswordChange(e) {
        this.setState({
            password: e.target.value
        })
    }

    render(){
        const { classes, history } = this.props
        return (
            <AuthConsumer>
                {
                    ({token, login})=> (
                        token 
                        ? <Redirect to={{pathname: '/'}}/>
                        : <React.Fragment>
                            <main className={classes.layout}>
                                <Paper className={classes.paper}>
                                    <Avatar className={classes.avatar}>
                                        <LockIcon />
                                    </Avatar>
                                    <Typography variant="headline">Sign in</Typography>
                                    <form className={classes.form}>
                                        <FormControl margin="normal" required fullWidth>
                                            <InputLabel htmlFor="email">Email Address</InputLabel>
                                            <Input 
                                                id="email" 
                                                name="email" 
                                                autoComplete="email" 
                                                autoFocus
                                                onChange={this.onEmailChange.bind(this)} />
                                        </FormControl>
                                        <FormControl margin="normal" required fullWidth>
                                            <InputLabel htmlFor="password">Password</InputLabel>
                                            <Input
                                                name="password"
                                                type="password"
                                                id="password"
                                                autoComplete="current-password"
                                                onChange={this.onPasswordChange.bind(this)} />
                                        </FormControl>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="raised"
                                            color="primary"
                                            className={classes.submit}
                                            onClick={
                                                (e)=>{ 
                                                    e.preventDefault()
                                                    if(this.state.email && this.state.password) login(this.state.email, this.state.password) 
                                                }} >
                                            Sign in
                                        </Button>
                                        
                                        <Button
                                            size="small"
                                            color="secondary"
                                            className={classes.submit}
                                            onClick={()=>{history.push('/register')}}
                                            >
                                            Register
                                        </Button>
                                        <Button
                                            size="small"
                                            color="secondary"
                                            className={classes.submit}
                                            onClick={()=>{history.push('/forgotpassword')}}
                                            >
                                            Forgot password
                                        </Button>
                                    </form>
                                </Paper>
                            </main>
                        </React.Fragment>
                    )
                }
            </AuthConsumer>
        )
    }
}
export default withStyles(styles)(LoginPage)