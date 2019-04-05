import React, { Component } from 'react'
import { graphql, compose, Query } from 'react-apollo'
import { clones, teams, keys } from '../../../GraphQL/Calls'
import { DateTime } from 'luxon';
import TopBar from '../../BannerTopBar'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import styles from './styles'
import { isDefined, getIndicatorYears } from '../../../utils'
import {
  tradingStartModes, indicatorStartModes, availableMonths, availableTimePeriods,
  sensorProcessNames, indicatorProcessNames, tradingProcessNames, botTypes, exchanges
} from '../../../GraphQL/models'

import {
  MenuItem, Button, TextField, FormControl, InputLabel, Input, Typography,
  Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Select, FormControlLabel, Checkbox, FormHelperText
} from '@material-ui/core'
import { DateTimePicker } from 'material-ui-pickers'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'

class AddClone extends Component {

  constructor(props) {
    super(props)
    let user = localStorage.getItem('user')
    this.state = {
      user: JSON.parse(user),
      selectedBot: { 'id': '' },
      mode: '',
      resumeExecution: true,
      beginDatetime: DateTime.local().minus({ days: 8 }).startOf('day'),
      endDatetime: DateTime.local(),
      waitTime: 1,
      state: '',
      stateDatetime: 0,
      createDatetime: 0,
      runAsTeam: false,
      teams: [],
      teamId: '',
      keyId: '',
      exchangeName: exchanges.Coss,
      processName: '',

      // Indicator Bot
      startYear: 2019,
      endYear: 2019,
      month: 1,

      //TradingBot
      timePeriod: '01-hs',

      //Error handlers
      nameError: false,
      teamError: false,
      botError: false,
      modeError: false,
      isNewCloneConfirmationOpen: false,
      serverResponse: '',
      serverError: false,
      processNameError: false,
      keyIdError: false,
    }
  }

  render() {
    const { classes } = this.props
    if (!isDefined(this.state.user)) {
      return (
        <TopBar
          size='big'
          title='Create a bot clone'
          text="Please login to create a bot clone."
          backgroundUrl='https://superalgos.org/img/photos/ecosystem.jpg'
        />
      )
    } else return (
      <React.Fragment>
        <TopBar
          size='medium'
          title='Create a bot clone'
          text='Create a bot clone here.'
          backgroundUrl='https://superalgos.org/img/photos/ecosystem.jpg'
        />

        <div className='container'>
          <Paper className={classNames('container', classes.root)}>

            <form noValidate autoComplete="off" onSubmit={this.submitForm.bind(this)}>
              <Typography className={classes.typography} variant='h5' gutterBottom>
                Create a Bot Clone
              </Typography>

              <Typography className={classes.typography} variant='subtitle1' align='justify'>
                A bot clone it's a copy of your bot running on a virtual machine.
                Please select from your teams and bots the one you want to clone!
              </Typography>

              <FormControl className={classNames(classes.form, classes.textField)} fullWidth>
                <InputLabel shrink htmlFor='select'>
                  Select Team and Bot
                </InputLabel>
                <Query query={teams.GET_ALL_TEAMS_QUERY} >
                  {({ loading, error, data }) => {
                    if (error) return `Error! There has been an error loading teams.`

                    if (loading) {
                      return (
                        <Select
                          value='loading'
                          input={<Input />}
                          displayEmpty
                          className={classes.selectEmpty}
                          disabled
                        >
                          <MenuItem key='1' value='loading'>Loading...</MenuItem>
                        </Select>
                      )
                    }

                    if (!isDefined(data.teams_TeamsByOwner)) {
                      return (
                        <Select
                          value='noteams'
                          input={<Input />}
                          displayEmpty
                          className={classes.selectEmpty}
                          disabled
                        >
                          <MenuItem key='1' value='noteams'>You don't have any teams yet.</MenuItem>
                        </Select>
                      )
                    } else {
                      this.teams = data.teams_TeamsByOwner
                    }

                    return (
                      <Select
                        value={this.state.selectedBot.id}
                        displayEmpty
                        className={classes.selectEmpty}
                        onBlur={(e) => this.setState({ botError: false })}
                        error={this.state.botError}
                        onChange={e => this.setSelectedBot(e.target.value)}
                      >
                        {
                          data.teams_TeamsByOwner.map(team => (
                            team.fb.map(financialBeing => (
                              <MenuItem key={financialBeing.id} value={financialBeing.id}>
                                {team.name + '/' + financialBeing.name}
                              </MenuItem>
                            ))
                          ))
                        }
                      </Select>
                    )
                  }}
                </Query>
                <FormHelperText>{this.state.selectedBot.kind}</FormHelperText>
              </FormControl>

              <TextField label="Exchange"
                select
                className={classNames(classes.margin, classes.textField, classes.form)}
                value={this.state.exchangeName}
                onChange={(e) => this.setState({ exchangeName: e.target.value })}
                fullWidth
              >
                {Object.keys(exchanges).map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              {this.state.selectedBot.kind === botTypes.Trading &&
                <React.Fragment>
                  <Typography className={classes.typography} variant='subtitle1' align='justify'>
                    Available Running Modes are Backtest and Live.
                      <ul>
                      <li>  Backtest mode does NOT put real orders at the exchange;
                            it simulates the order execution at the specified price.
                        </li>
                      <li>
                        Live mode DOES put real orders at the exchange.
                        </li>
                    </ul>
                  </Typography>


                  <TextField label="Running Mode"
                    select
                    className={classNames(classes.margin, classes.textField, classes.form)}
                    value={this.state.mode}
                    onChange={(e) => this.setState({ mode: e.target.value })}
                    onBlur={(e) => this.setState({ modeError: false })}
                    error={this.state.modeError}
                    fullWidth
                  >
                    {Object.keys(tradingStartModes).map(option => (
                      <MenuItem key={option} value={option}>
                        {tradingStartModes[option]}
                      </MenuItem>
                    ))}
                  </TextField>

                  {this.state.mode == "backtest" &&
                    <React.Fragment>
                      <DateTimePicker
                        autoOk
                        disableFuture
                        format="DD' at 'HH:mm"
                        ampm={false}
                        showTabs={false}
                        leftArrowIcon={<ChevronLeft />}
                        rightArrowIcon={<ChevronRight />}
                        value={this.state.beginDatetime}
                        label='Backtest Start Date'
                        onChange={newVal => this.setState({ beginDatetime: newVal })}
                        className={classNames(classes.form, classes.textField)}
                        fullWidth
                      />

                      <DateTimePicker
                        autoOk
                        disableFuture
                        format="DD' at 'HH:mm"
                        ampm={false}
                        showTabs={false}
                        leftArrowIcon={<ChevronLeft />}
                        rightArrowIcon={<ChevronRight />}
                        value={this.state.endDatetime}
                        label='Backtest End Date'
                        onChange={newVal => this.setState({ endDatetime: newVal })}
                        className={classNames(classes.form, classes.textField)}
                        fullWidth
                      />
                    </React.Fragment>
                  }

                  {this.state.mode == "live" &&
                    <React.Fragment>
                      <Typography className={classes.typography} variant='subtitle1' align='justify'>
                        Select one of your available Exchange API Keys to be used by this clone.
                           </Typography>

                      <Query
                        query={keys.GET_ALL_KEYS}
                      >
                        {({ loading, error, data }) => {
                          if (loading) return (
                            <TextField
                              select
                              label="Exchange API Key"
                              className={classNames(classes.margin, classes.textField, classes.form)}
                              value={this.state.keyId}
                              onChange={(e) => this.setState({ keyId: e.target.value })}
                              onBlur={(e) => this.setState({ keyIdError: false })}
                              error={this.state.keyIdError}
                              fullWidth
                            >
                              <MenuItem key='1' value='Loading keys...'>
                                'Loading keys...'
                                    </MenuItem>
                            </TextField>
                          );
                          if (error) return `Error! ${error.message}`;
                          const list = data.keyVault_AvailableKeys.map((key) => (
                              <MenuItem key={key.id} value={key.id}>
                                {key.key.substr(0, 32) + "..." + " - " + key.exchange}
                              </MenuItem>
                          ));
                          return (
                            <TextField
                              select
                              label="Exchange API Key"
                              className={classNames(classes.margin, classes.textField, classes.form)}
                              value={this.state.keyId}
                              onChange={(e) => this.setState({ keyId: e.target.value })}
                              onBlur={(e) => this.setState({ keyIdError: false })}
                              error={this.state.keyIdError}
                              fullWidth
                            >
                              {list}
                            </TextField>
                          );
                        }}
                      </Query>

                      <Typography className={classes.typography} variant='subtitle1' align='justify'>
                        Because we are still in early alpha-testing phase,
                        Live Trading Clones are limited to an initial investment
                        of 0.001 BTC. If you choose to run this bot or any modified
                        version of the code, you are doing it at your own risk.
                           </Typography>

                    </React.Fragment>
                  }

                  <Typography className={classes.typography} variant='subtitle1' align='justify'>
                    The Time Period in which the bot will operate.
                    </Typography>

                  <TextField label="Time Period"
                    select
                    className={classNames(classes.margin, classes.textField, classes.form)}
                    value={this.state.timePeriod}
                    onChange={(e) => this.setState({ timePeriod: e.target.value })}
                    fullWidth
                  >
                    {availableTimePeriods.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>

                </React.Fragment>
              }

              {this.state.selectedBot.kind === botTypes.Indicator &&
                <React.Fragment>
                  <TextField label="Process Name"
                    select
                    className={classNames(classes.textField, classes.form)}
                    value={this.state.processName}
                    onChange={(e) => this.setState({ processName: e.target.value })}
                    onBlur={(e) => this.setState({ processNameError: false })}
                    error={this.state.processNameError}
                    fullWidth
                  >
                    {Object.keys(indicatorProcessNames).map((option, index) => (
                      <MenuItem key={index} value={indicatorProcessNames[option]}>
                        {indicatorProcessNames[option]}
                      </MenuItem>
                    ))}
                  </TextField>
                </React.Fragment>
              }

              {this.state.selectedBot.kind === botTypes.Sensor &&
                <React.Fragment>
                  <TextField label="Process Name"
                    select
                    className={classNames(classes.textField, classes.form)}
                    value={this.state.processName}
                    onChange={(e) => this.setState({ processName: e.target.value })}
                    onBlur={(e) => this.setState({ processNameError: false })}
                    error={this.state.processNameError}
                    fullWidth
                  >
                    {Object.keys(sensorProcessNames).map((option, index) => (
                      <MenuItem key={index} value={sensorProcessNames[option]}>
                        {sensorProcessNames[option]}
                      </MenuItem>
                    ))}
                  </TextField>
                </React.Fragment>
              }

              {(this.state.selectedBot.kind === botTypes.Indicator
                || this.state.selectedBot.kind === botTypes.Sensor) &&
                <React.Fragment>
                  <TextField label="Running Mode"
                    select
                    className={classNames(classes.margin, classes.textField, classes.form)}
                    value={this.state.mode}
                    onChange={(e) => this.setState({ mode: e.target.value })}
                    onBlur={(e) => this.setState({ modeError: false })}
                    error={this.state.modeError}
                    fullWidth
                  >
                    {Object.keys(indicatorStartModes).map(option => (
                      <MenuItem key={option} value={option}>
                        {indicatorStartModes[option]}
                      </MenuItem>
                    ))}
                  </TextField>

                  {this.state.mode === "allMonths" &&
                    <React.Fragment>
                      <TextField
                        id="beginYearInput"
                        select
                        label="Start Year"
                        className={classNames(classes.textField, classes.form)}
                        value={this.state.startYear}
                        onChange={(e) => this.setState({ startYear: e.target.value })}
                        fullWidth
                      >
                        {getIndicatorYears().map(option => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        id="endYearInput"
                        select
                        label="End Year"
                        className={classNames(classes.textField, classes.form)}
                        value={this.state.endYear}
                        onChange={(e) => this.setState({ endYear: e.target.value })}
                        fullWidth
                      >
                        {getIndicatorYears().map(option => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </React.Fragment>
                  }

                  {this.state.mode === "oneMonth" &&
                    <React.Fragment>
                      <TextField
                        id="beginYearInput"
                        select
                        label="Year"
                        className={classNames(classes.textField, classes.form)}
                        value={this.state.startYear}
                        onChange={(e) => this.setState({ startYear: e.target.value })}
                        fullWidth
                      >
                        {getIndicatorYears().map(option => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        id="endMonthInput"
                        select
                        label="Month"
                        className={classNames(classes.textField, classes.form)}
                        value={this.state.month}
                        onChange={(e) => this.setState({ month: e.target.value })}
                        fullWidth
                      >
                        {availableMonths.map((option, index) => (
                          <MenuItem key={index} value={index + 1}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </React.Fragment>
                  }
                </React.Fragment>
              }


              {(this.state.mode === "noTime" && this.state.selectedBot.kind !== botTypes.Sensor ) &&
                <React.Fragment>
                  <Typography className={classes.typography} variant='subtitle1' align='justify'>
                    The Resume Execution option let's you pick up the context of
                    the last execution and continue from there.
                            </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.resumeExecution}
                        onChange={(e) => this.setState({ resumeExecution: e.target.checked })}
                        value="resumeExecution"
                        color="primary"
                      />
                    }
                    label="Resume Execution"
                    className={classNames(classes.form, classes.textField)}
                  />
                  {!this.state.resumeExecution &&
                    <DateTimePicker
                      autoOk
                      disableFuture
                      format="DD' at 'HH:mm"
                      ampm={false}
                      showTabs={false}
                      leftArrowIcon={<ChevronLeft />}
                      rightArrowIcon={<ChevronRight />}
                      value={this.state.beginDatetime}
                      label='Start Date'
                      onChange={newVal => this.setState({ beginDatetime: newVal })}
                      className={classNames(classes.form, classes.textField)}
                      fullWidth
                    />
                  }

                </React.Fragment>
              }

              <Typography className={classes.typography} variant='subtitle1' align='justify'>
                You will be able to see the clone information under Active Clones.
                Whenever you decide to stop the clone you can delete it. On History Clones will find all deleted clones.
               </Typography>

              <div className={classes.actionButton} >
                <Button
                  type="submit"
                  variant='contained' color='secondary'>
                  Clone Bot!
                 </Button>
              </div>

            </form>

            <Dialog
              open={this.state.isNewCloneConfirmationOpen}
              onClose={this.handleNewCloneConfirmationClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Creating bot clone</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {this.state.serverResponse}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleNewCloneConfirmationClose}
                  variant='contained' color='secondary' autoFocus>
                  Ok
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </div>
      </React.Fragment>
    );
  }

  setSelectedBot(botId) {
    if (isDefined(this.teams)) {
      for (var j = 0; j < this.teams.length; j++) {
        for (var i = 0; i < this.teams[j].fb.length; i++) {
          if (this.teams[j].fb[i].id === botId) {
            this.setState({ selectedBot: this.teams[j].fb[i] })
            this.setState({ teamId: this.teams[j].id })
            return
          }
        }
      }
    }
  }

  async submitForm(e) {
    e.preventDefault()
    let error = this.validate()
    if (!error) {
      let serverResponse = await this.createCloneOnServer()
      error = serverResponse.errors || !isDefined(serverResponse.data.operations_AddClone)
      if (error) {
        this.state.serverResponse = serverResponse.errors[0].message || serverResponse.errors[0]
        this.state.serverError = true
      } else {
        this.state.serverResponse = "The new clone was sucessfully created."
        this.state.serverError = false
      }

      this.handleNewCloneConfirmationOpen()
    }
  }

  async createCloneOnServer() {
    let variables = {
      clone: {
        teamId: this.state.teamId,
        botId: this.state.selectedBot.id,
        mode: this.state.mode,
        resumeExecution: this.state.resumeExecution,
        botType: this.state.selectedBot.kind,
        exchangeName: this.state.exchangeName
      }
    }

    if (this.state.selectedBot.kind === "Trading") {
      variables.clone.runAsTeam = this.state.runAsTeam
      variables.clone.processName = 'Trading-Process'
      variables.clone.timePeriod = this.state.timePeriod
      if (this.state.mode === "backtest") {
        variables.clone.beginDatetime = this.state.beginDatetime.valueOf() / 1000 | 0
        variables.clone.endDatetime = this.state.endDatetime.valueOf() / 1000 | 0
        variables.clone.waitTime = this.state.waitTime
      } else {
        variables.clone.keyId = this.state.keyId
      }
    } else {
      variables.clone.processName = this.state.processName
      variables.clone.startYear = this.state.startYear
      variables.clone.endYear = this.state.endYear
      variables.clone.month = this.state.month
      variables.clone.runAsTeam = true
      variables.clone.beginDatetime = this.state.beginDatetime.valueOf() / 1000 | 0
    }

    return this.props.addCloneMutation({
      variables: variables
    })
  }

  handleNewCloneConfirmationOpen = () => {
    this.setState({ isNewCloneConfirmationOpen: true })
  };

  handleNewCloneConfirmationClose = () => {
    this.setState({
      isNewCloneConfirmationOpen: false
    })

    if (!this.state.serverError)
      this.setState({
        selectedBot: { 'id': '' },
        mode: '',
        resumeExecution: true,
        beginDatetime: DateTime.local().minus({ days: 8 }).startOf('day'),
        endDatetime: DateTime.local(),
        waitTime: 1,
        state: '',
        stateDatetime: 0,
        createDatetime: 0,
        runAsTeam: false,
        processName: '',
        teams: [],
        teamId: '',
        keyId: '',

        //Error handlers
        nameError: false,
        teamError: false,
        botError: false,
        modeError: false,
        isNewCloneConfirmationOpen: false,
        serverResponse: '',
        serverError: false,
        processNameError: false,
        keyIdError: false
      })
  };

  validate() {
    let isError = false

    if (this.state.selectedBot.length < 1) {
      isError = true
      this.setState(state => ({ selectedBotError: true }));
    }

    if (this.state.mode.length < 1) {
      isError = true
      this.setState(state => ({ modeError: true }));
    }

    if (this.state.selectedBot.kind !== "Trading"
      && this.state.processName.length < 1) {
      isError = true
      this.setState(state => ({ processNameError: true }));
    }

    return isError;

  }
}

export default compose(
  graphql(clones.OPERATIONS_ADD_CLONE, { name: 'addCloneMutation' }),
  withStyles(styles)
)(AddClone)
