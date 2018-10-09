import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { AuthConsumer } from '../context/auth.context'
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Avatar
} from '@material-ui/core'

import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import DashboardIcon from '@material-ui/icons/Dashboard'

import RegisterPage from './registerPage'
import LoginPage from './loginPage'
import ForgotPasswordPage from './forgotPasswordPage'
import ResetPasswordPage from './resetPasswordPage'
import HomePage from './homePage'

const drawerWidth = 240

const styles = theme => ({

    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        height: '100vh',
        overflow: 'auto',
    },
})

class Main extends Component {

    state = {
        drawerOpen: false,
        path: null,
        profileAnchorElement: null,
    }
    handleMenu = event => {
        this.setState({ profileAnchorElement: event.currentTarget })
    }
    
    handleClose = () => {
        this.setState({ profileAnchorElement: null })
    }

    handleDrawerOpen = () => {
        this.setState({ drawerOpen: true })
    };

    handleDrawerClose = () => {
        this.setState({ drawerOpen: false })
    }

    routeIs(r) {
        return this.props.location === r
    }

    updatePath(path) {
        this.setState({path})
    }

    render() {

        const { classes } = this.props
        const { profileAnchorElement } = this.state

        return (
            <Router>
                <div className={classes.root}>
                <AuthConsumer>
                        {
                            ({token, logout, user})=> (
                                token &&
                                    <React.Fragment>
                                    <AppBar
                                        position="absolute"
                                        className={classNames(classes.appBar, this.state.drawerOpen && classes.appBarShift)} >

                                        <Toolbar disableGutters={!this.state.drawerOpen} className={classes.toolbar}>
                                            <IconButton
                                                color="inherit"
                                                aria-label="Open drawer"
                                                onClick={this.handleDrawerOpen}
                                                className={classNames(
                                                    classes.menuButton,
                                                    this.state.drawerOpen && classes.menuButtonHidden,
                                                )}>

                                                <MenuIcon />

                                            </IconButton>
                                            <Typography variant="title" color="inherit" noWrap className={classes.title}>
                                                Dashboard
                                            </Typography>

                                            <IconButton onClick={this.handleMenu}>
                                            {console.log(user.gravatar)}
                                                <Avatar alt={user.name} src={user.gravatar} />
                                            </IconButton>
                                            <Menu
                                                id="menu-appbar"
                                                anchorEl={profileAnchorElement}
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                open={profileAnchorElement !== null}
                                                onClose={this.handleClose} >
                                                    <MenuItem onClick={()=>{
                                                        this.handleClose()
                                                        logout()
                                                    }}>
                                                        Log out
                                                    </MenuItem>
                                                </Menu>
                                        </Toolbar>

                                    </AppBar>
                                    
                                    <Drawer
                                        variant="permanent"
                                        classes={{
                                            paper: classNames(classes.drawerPaper, !this.state.drawerOpen && classes.drawerPaperClose)
                                        }}
                                        open={this.state.drawerOpen} >

                                        <div className={classes.toolbarIcon}>
                                            <IconButton onClick={this.handleDrawerClose}>
                                                <ChevronLeftIcon />
                                            </IconButton>
                                        </div>

                                        <Divider />
                                        
                                        <List>
                                            <ListItem
                                                button
                                                selected={this.state.path === '/'}>  
                                                <ListItemIcon>
                                                    <DashboardIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Dashboard" />
                                            </ListItem>
                                        </List>
                                        
                                    </Drawer>
                                    </React.Fragment>
                        )
                    }
                    </AuthConsumer>

                    <main className={classes.content}>
                        <div className={classes.appBarSpacer} />
                        <Route exact path="/" render={ (props)=><HomePage updatePath={this.updatePath.bind(this)} {...props}/> } />
                        <Route path="/register" component={RegisterPage} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/forgotPassword" component={ForgotPasswordPage} />
                        <Route path="/resetPassword/:resetToken" component={ResetPasswordPage} />
                    </main>

                </div>
            </Router>
        )
    }
}


export default withStyles(styles)(Main)