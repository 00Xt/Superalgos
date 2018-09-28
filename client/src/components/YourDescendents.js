import React, { Component } from 'react'
import {compose} from 'react-apollo'

// Materia UI

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

// components
import DescendentsTree from './DescendentsTree'

const styles = theme => ({
  root: {
    width: '50%',
    flexGrow: 1,
    padding: 10,
    marginLeft: '25%',
    marginTop: '2%'
  },
  typography: {
    width: '80%',
    marginLeft: '10%',
    marginTop: 40,
    marginBottom: 40
  },
  grid: {
    paddingTop: '30',
    marginTop: 30
  }
})

class YourDescendents extends Component {

  constructor (props) {
    super(props)

    this.defaultValuesSet = false

    this.state = {
      id: ''
    }
  }

  componentWillMount ()    	{
    if (this.defaultValuesSet === false)    	    {
      let userData = localStorage.getItem('loggedInUser')

      if (userData === 'undefined') { return }

      let user = JSON.parse(userData)
      this.defaultValuesSet = true

      /* Now we are ready to set the initial state. */
      this.setState({
        id: user.id
      })
    }
  }

  render () {
    const { classes } = this.props

    return (
      <Paper className={classes.root}>
        <Typography className={classes.typography} variant='headline' gutterBottom>
            Your Descendents
        </Typography>

        <Typography className={classes.typography} variant='body1' gutterBottom align='left'>
        These are your decendents within the project. Your children referred you as the one who brought them to the project, while
        your grandchildren referred your children and so on.
        </Typography>

        <DescendentsTree userId={this.state.id} />
        <Grid container className={classes.grid} justify='center' spacing={24} />
      </Paper>
    )
  }
}

export default compose(
  withStyles(styles)
)(YourDescendents) // This technique binds more than one query to a single component.
