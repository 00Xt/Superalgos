exports.newSuperalgosFunctionLibrariesNodeJSFunctions = function () {

    let thisObject = {
        exitProcess: exitProcess
    }

    let isNodeJsProcessShuttingDown = false
    return thisObject

    function exitProcess() {

        if (TS.projects.superalgos.globals.taskVariables.FATAL_ERROR_MESSAGE !== undefined) {
            TS.projects.superalgos.functionLibraries.taskFunctions.taskError(
                undefined,
                "An unexpected error caused the Task to stop. " + TS.projects.superalgos.globals.taskVariables.FATAL_ERROR_MESSAGE,
                {
                    project: 'Superalgos',
                    category: 'Topic',
                    type: 'TS Task Error - Unexpected Error'
                }
            )
        }

        if (isNodeJsProcessShuttingDown === true) { return }
        isNodeJsProcessShuttingDown = true

        /* Signal that all sessions are stopping. */
        TS.projects.superalgos.functionLibraries.sessionFunctions.finalizeSessions()

        /* Cleaning Before Exiting. */
        clearInterval(TS.projects.superalgos.globals.taskConstants.TASK_HEARTBEAT_INTERVAL_HANDLER)

        if (TS.projects.superalgos.globals.taskConstants.TASK_NODE !== undefined) {
            for (let i = 0; i < TS.projects.superalgos.globals.taskConstants.TASK_NODE.bot.processes.length; i++) {
                let config = TS.projects.superalgos.globals.taskConstants.TASK_NODE.bot.processes[i].config
                let process = TS.projects.superalgos.globals.taskConstants.TASK_NODE.bot.processes[i]

                let key = process.name + '-' + process.type + '-' + process.id
                TS.projects.superalgos.globals.taskConstants.EVENT_SERVER_CLIENT_MODULE_OBJECT.raiseEvent(key, 'Stopped') // Meaning Process Stopped
            }
        }

        finalizeLoggers()

        setTimeout(process.exit, 10000) // We will give 10 seconds to logs be written on file

        function finalizeLoggers() {
            TS.projects.superalgos.globals.taskVariables.LOGGER_MAP.forEach(forEachLogger)

            function forEachLogger(logger) {
                if (logger !== undefined) {
                    logger.finalize()
                }
            }
        }
    }
}