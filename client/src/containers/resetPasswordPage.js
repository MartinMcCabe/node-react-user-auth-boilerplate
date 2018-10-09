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

class ResetPasswordPage extends Component{
    state={
        email: null,
        password: null,
        confirmPassword: null,
        passwordsMatch: null,
    }
    
    onPasswordChange(e) {
        this.setState({
            password: e.target.value
        })
    }

    onConfirmPasswordChange(e) {
        this.setState({
            confirmPassword: e.target.value,
            passwordsMatch: e.target.value === this.state.password
        })
    }

    onEmailChange(e) {
        this.setState({
            email: e.target.value
        })
    }

    render(){
        const { classes, history, match: {params: {resetToken}} } = this.props
        console.log(resetToken)
        return (
            <AuthConsumer>
                {
                    ({token, resetPassword})=> (
                        token 
                        ? <Redirect to={{pathname: '/'}}/>
                        : <React.Fragment>
                            <main className={classes.layout}>
                                <Paper className={classes.paper}>
                                    <Avatar className={classes.avatar}>
                                        <LockIcon />
                                    </Avatar>
                                    <Typography variant="headline">Reset Password</Typography>
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
                                            <InputLabel htmlFor="password">New Password</InputLabel>
                                            <Input
                                                name="password"
                                                type="password"
                                                id="password"
                                                autoComplete="current-password"
                                                onChange={this.onPasswordChange.bind(this)} />
                                        </FormControl>
                                        <FormControl margin="normal" required fullWidth>
                                            <InputLabel htmlFor="password">Confirm Password</InputLabel>
                                            <Input
                                                name="confirm-password"
                                                type="confirm-password"
                                                id="confirm-password"
                                                onChange={this.onConfirmPasswordChange.bind(this)} />
                                        </FormControl>
                                        {
                                            this.state.confirmPassword && !this.state.passwordsMatch && 
                                            <Typography variant="caption" color="error">Passwords don't match!</Typography>
                                        }
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="raised"
                                            color="primary"
                                            className={classes.submit}
                                            onClick={
                                                (e)=>{ 
                                                    e.preventDefault()
                                                    if(this.state.email && this.state.password && this.state.passwordsMatch) resetPassword(this.state.email, this.state.password, resetToken) 
                                                }} >
                                            Reset Password
                                        </Button>
                                    
                                        <Button
                                            size="small"
                                            color="secondary"
                                            className={classes.submit}
                                            onClick={()=>{history.push('/login')}}
                                            >
                                            Log in
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
export default withStyles(styles)(ResetPasswordPage)