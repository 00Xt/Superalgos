import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Mutation } from 'react-apollo'

import Button from '@material-ui/core/Button'
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'

import DELETE_TEAM from '../../../graphql/teams/DeleteTeamMutation'
import GET_TEAMS_BY_OWNER from '../../../graphql/teams/GetTeamsByOwnerQuery'

import { checkGraphQLError } from '../../../utils/graphql-errors'

const styles = theme => ({
  dialogContainer: {
    display: 'block',
    margin: '3em',
    minWidth: 400
  },
  buttonRight: {
    justifyContent: 'flex-end'
  }
})

export class ManageMemberDelete extends Component {
  constructor (props) {
    super(props)

    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      open: false
    }
  }

  handleClickOpen () {
    this.setState({ open: true })
  }

  handleClose () {
    this.setState({ open: false })
  }

  handleChange (e) {
    this.setState({ name: e.target.value })
  }

  render () {
    console.log(this.props, this.props.teamId)
    const { classes, teamId, authId } = this.props
    return (
      <Mutation
        mutation={DELETE_TEAM}
        refetchQueries={[
          {
            query: GET_TEAMS_BY_OWNER,
            variables: { authId }
          }
        ]}
      >
        {(deleteTeam, { loading, error, data }) => {
          let errors
          let loader
          if (loading) {
            loader = (
              <Typography variant='caption'>Submitting team...</Typography>
            )
          }
          if (error) {
            errors = error.graphQLErrors.map(({ message }, i) => {
              const displayMessage = checkGraphQLError(message)
              console.log('createTeam error:', displayMessage)
              return (
                <Typography key={i} variant='caption'>
                  {message}
                </Typography>
              )
            })
          }
          return (
            <div>
              <Button
                size='small'
                color='primary'
                className={classes.buttonRight}
                onClick={this.handleClickOpen}
              >
                <PersonAddDisabledIcon /> Remove
              </Button>
              <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby='form-dialog-title'
              >
                <div classes={classes.dialogContainer}>
                  <DialogTitle id='form-dialog-title'>
                    Remove Team Member
                  </DialogTitle>
                  <DialogContent>
                    <Typography variant='subheading' color='primary'>
                      DANGER - Removing your team cannot be undone
                    </Typography>
                    <Typography variant='subheading'>
                      Are you sure you want to remove this team member?
                    </Typography>
                    {loader}
                    {errors}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClose} color='primary'>
                      Cancel
                    </Button>
                    <Button
                      onClick={e => {
                        this.handleSubmit(
                          e,
                          deleteTeam,
                          teamId
                        )
                      }}
                      color='primary'
                    >
                      Remove Member
                    </Button>
                  </DialogActions>
                </div>
              </Dialog>
            </div>
          )
        }}
      </Mutation>
    )
  }

  async handleSubmit (e, deleteTeam, teamId) {
    e.preventDefault()
    await deleteTeam({ variables: { teamId } })
    this.setState({ open: false })
  }
}

ManageMemberDelete.propTypes = {
  classes: PropTypes.object.isRequired,
  teamId: PropTypes.string.isRequired,
  authId: PropTypes.string.isRequired
}

export default withStyles(styles)(ManageMemberDelete)
