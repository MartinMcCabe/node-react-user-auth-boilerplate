import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
});

class Message extends Component {

  render() {
    const { open, message, handleClose, autoHideDuration, actions } = this.props;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={open}
          autoHideDuration={autoHideDuration || 3000}
          onClose={handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={message}
          action={actions || []}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Message)