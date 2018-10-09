import React from 'react'
import PageContainer from './pageContainer'
import { AuthConsumer } from '../context/auth.context'
import { Redirect } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'


const styles = theme => ({
    layout: {
        // maxWidth: 800,
        display: 'block', // Fix IE11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        marginLeft: 'auto',
        marginRight: 'auto',
        },
    },
})

class HomePage extends PageContainer{

    saveNewGroup(data){
        // TODO
    }

    render(){
        const {classes} = this.props
        return (
            <AuthConsumer>
                {
                    ({token, user}) => (
                        token 
                        ? <main className={classes.layout}>
                            <div>Welcome {user.name}</div>
                          </main>
                        : <Redirect 
                            to={{
                                pathname: '/login'
                            }} />
                    )
                }
            </AuthConsumer>
        )
    }
}
export default withStyles(styles)(HomePage)