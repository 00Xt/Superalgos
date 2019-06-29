
function newWorkspace () {
  const MODULE_NAME = 'Workspace'

  let thisObject = {
    tradingSystem: undefined,
    container: undefined,
    onMenuItemClick: onMenuItemClick,
    getProtocolTradingSystem: getProtocolTradingSystem,
    physics: physics,
    spawn: spawn,
    detachNode: detachNode,
    attachNode: attachNode,
    getContainer: getContainer,
    initialize: initialize,
    finalize: finalize
  }

  thisObject.container = newContainer()
  thisObject.container.initialize(MODULE_NAME)
  thisObject.container.isClickeable = false
  thisObject.container.isDraggeable = false
  thisObject.container.isWheelable = false
  thisObject.container.detectMouseOver = false
  thisObject.container.frame.radius = 0
  thisObject.container.frame.position.x = 0
  thisObject.container.frame.position.y = 0
  thisObject.container.frame.width = 0
  thisObject.container.frame.height = 0

  spawnPosition = {
    x: canvas.floatingSpace.container.frame.width / 2,
    y: canvas.floatingSpace.container.frame.height / 2
  }

  let workspaceNode = {}
  workspaceNode.rootNodes = []

  functionLibraryAttachDetach = newAttachDetach()
  functionLibraryNodeDeleter = newNodeDeleter()
  functionLibraryPartsFromNodes = newPartsFromNodes()
  functionLibraryProtocolNode = newProtocolNode()
  functionLibraryWorkspaceNodes = newStringifyNode()

  let isInitialized = false
  return thisObject

  function finalize () {
    thisObject.tradingSystem = undefined
    thisObject.container.finalize()
    thisObject.container = undefined
  }

  async function initialize () {
    let user = window.localStorage.getItem(LOGGED_IN_USER_LOCAL_STORAGE_KEY)
    if (user === null) {
      return
    }
    user = JSON.parse(user)

    let savedWorkspace = window.localStorage.getItem(user.alias + '.' + 'workspace')
    if (savedWorkspace === null) {
      workspaceNode.type = 'Workspace'
      workspaceNode.name = 'My Workspace'
      functionLibraryPartsFromNodes.createPartFromNode(workspaceNode, undefined, undefined)
      spawnPosition.y = spawnPosition.y + 250
      initializeLoadingFromStrategizer()
    } else {
      workspaceNode = JSON.parse(savedWorkspace)
      functionLibraryPartsFromNodes.createPartFromNode(workspaceNode, undefined, undefined)
      for (let i = 0; i < workspaceNode.rootNodes.length; i++) {
        let rootNode = workspaceNode.rootNodes[i]
        functionLibraryPartsFromNodes.createPartFromNode(rootNode, undefined, undefined)
      }
      isInitialized = true
    }
  }

  async function initializeLoadingFromStrategizer () {
    let result = await canvas.strategySpace.strategizerGateway.loadFromStrategyzer()
    if (result === true) {
      thisObject.tradingSystem = canvas.strategySpace.strategizerGateway.strategizerData
      workspaceNode.rootNodes.push(thisObject.tradingSystem)
      functionLibraryPartsFromNodes.createPartFromNode(thisObject.tradingSystem, undefined, undefined)
      thisObject.tradingSystem.payload.uiObject.setRunningStatus()
    } else {
      // First use of the Designer, lets help by creating the first Trading System
      thisObject.tradingSystem = {
        type: 'Trading System',
        strategies: []
      }
      workspaceNode.rootNodes.push(thisObject.tradingSystem)
      functionLibraryPartsFromNodes.createPartFromNode(thisObject.tradingSystem, undefined, undefined)
      thisObject.tradingSystem.payload.uiObject.setRunningStatus()
    }
    isInitialized = true
  }

  function getContainer (point) {

  }

  function getProtocolTradingSystem () {
    return functionLibraryProtocolNode.getProtocolNode(thisObject.tradingSystem)
  }

  function detachNode (node) {
    functionLibraryAttachDetach.detachNode(node, workspaceNode.rootNodes)
  }

  function attachNode (node, attachToNode) {
    functionLibraryAttachDetach.attachNode(node, attachToNode, workspaceNode.rootNodes)
  }

  function physics () {
    if (isInitialized !== true) { return }
    /* Here we will save all the workspace related objects into the local storage */
    let user = window.localStorage.getItem(LOGGED_IN_USER_LOCAL_STORAGE_KEY)
    if (user === null) {
      return
    }
    user = JSON.parse(user)

    let textToSave = stringifyWorkspace()
    window.localStorage.setItem(user.alias + '.' + 'workspace', textToSave)
  }

  function stringifyWorkspace () {
    let stringifyReadyNodes = []
    for (let i = 0; i < workspaceNode.rootNodes.length; i++) {
      let rootNode = workspaceNode.rootNodes[i]
      let workspace = functionLibraryWorkspaceNodes.prepareForStringify(rootNode)
      stringifyReadyNodes.push(workspace)
    }
    let workspace = {
      type: 'Workspace',
      name: workspaceNode.name,
      rootNodes: stringifyReadyNodes
    }
    return JSON.stringify(workspace)
  }

  function spawn (nodeText, point) {
    point = canvas.floatingSpace.container.frame.unframeThisPoint(point)
    spawnPosition.x = point.x
    spawnPosition.y = point.y

    let droppedNode = JSON.parse(nodeText)

    if (droppedNode.type === 'Workspace') {
      functionLibraryNodeDeleter.deleteWorkspace(workspaceNode, workspaceNode.rootNodes)
      workspaceNode = droppedNode
      functionLibraryPartsFromNodes.createPartFromNode(workspaceNode, undefined, undefined)
      for (let i = 0; i < workspaceNode.rootNodes.length; i++) {
        let rootNode = workspaceNode.rootNodes[i]
        functionLibraryPartsFromNodes.createPartFromNode(rootNode, undefined, undefined)
      }
    } else {
      let rootNode = functionLibraryProtocolNode.getProtocolNode(droppedNode)
      workspaceNode.rootNodes.push(rootNode)
      functionLibraryPartsFromNodes.createPartFromNode(rootNode, undefined, undefined)
    }
  }

  async function onMenuItemClick (payload, action) {
    switch (action) {
      case 'Download Workspace':
        {
          let text = stringifyWorkspace()
          let fileName = payload.node.type + ' - ' + payload.node.name + '.json'
          download(fileName, text)
        }

        break
      case 'Save Trading System':
        {
          let result = await canvas.strategySpace.strategizerGateway.saveToStrategyzer()
          return result
          break
        }

      case 'Edit Code':

        break
      case 'Download':
        {
          let text = JSON.stringify(functionLibraryProtocolNode.getProtocolNode(payload.node))
          let nodeName = payload.node.name
          if (nodeName === undefined) {
            nodeName = ''
          } else {
            nodeName = '.' + nodeName
          }
          let fileName = payload.node.type + ' - ' + nodeName + '.json'
          download(fileName, text)
        }

        break

      case 'New Strategy':
        {
          functionLibraryPartsFromNodes.newStrategy(payload.node)
        }
        break
      case 'Add Parameters':
        {
          functionLibraryPartsFromNodes.addParameters(payload.node)
        }
        break
      case 'Add Missing Parameters':
        {
          functionLibraryPartsFromNodes.addMissingParameters(payload.node)
        }
        break
      case 'Add Missing Stages':
        {
          functionLibraryPartsFromNodes.addMissingStages(payload.node)
        }
        break
      case 'Add Missing Events':
        {
          functionLibraryPartsFromNodes.addMissingEvents(payload.node)
        }
        break
      case 'Add Position Size':
        {
          functionLibraryPartsFromNodes.addPositionSize(payload.node)
        }
        break
      case 'Add Missing Items':
        {
          functionLibraryPartsFromNodes.addMissingItems(payload.node)
        }
        break
      case 'Add Initial Definition':
        {
          functionLibraryPartsFromNodes.addInitialDefinition(payload.node)
        }
        break
      case 'Add Phase':
        {
          functionLibraryPartsFromNodes.addPhase(payload.node)
        }
        break
      case 'Add Formula':
        {
          functionLibraryPartsFromNodes.addFormula(payload.node)
        }
        break
      case 'Add Next Phase Event':
        {
          functionLibraryPartsFromNodes.addNextPhaseEvent(payload.node)
        }
        break
      case 'Add Situation':
        {
          functionLibraryPartsFromNodes.addSituation(payload.node)
        }
        break
      case 'Add Condition':
        {
          functionLibraryPartsFromNodes.addCondition(payload.node)
        }
        break
      case 'Add Code':
        {
          functionLibraryPartsFromNodes.addCode(payload.node)
        }
        break
      case 'Delete Trading System': {
        functionLibraryNodeDeleter.deleteTradingSystem(payload.node, workspaceNode.rootNodes)
        break
      }
      case 'Delete Parameters': {
        functionLibraryNodeDeleter.deleteParameters(payload.node, workspaceNode.rootNodes)
        break
      }
      case 'Delete Base Asset': {
        functionLibraryNodeDeleter.deleteBaseAsset(payload.node, workspaceNode.rootNodes)
        break
      }
      case 'Delete Strategy': {
        functionLibraryNodeDeleter.deleteStrategy(payload.node, workspaceNode.rootNodes)
        break
      }
      case 'Delete Trigger Stage': {
        functionLibraryNodeDeleter.deleteTriggerStage(payload.node, workspaceNode.rootNodes)
        break
      }
      case 'Delete Open Stage': {
        functionLibraryNodeDeleter.deleteOpenStage(payload.node, workspaceNode.rootNodes)
        break
      }
      case 'Delete Manage Stage': {
        functionLibraryNodeDeleter.deleteManageStage(payload.node, workspaceNode.rootNodes)
        break
      }
      case 'Delete Close Stage': {
        functionLibraryNodeDeleter.deleteCloseStage(payload.node, workspaceNode.rootNodes)
        break
      }
      case 'Delete Position Size': {
        functionLibraryNodeDeleter.deletePositionSize(payload.node, workspaceNode.rootNodes)
        break
      }
      case 'Delete Initial Definition': {
        functionLibraryNodeDeleter.deleteInitialDefinition(payload.node, workspaceNode.rootNodes)
        break
      }
      case 'Delete Event': {
        functionLibraryNodeDeleter.deleteEvent(payload.node, workspaceNode.rootNodes)
        break
      }
      case 'Delete Managed Item': {
        functionLibraryNodeDeleter.deleteManagedItem(payload.node, workspaceNode.rootNodes)
        break
      }
      case 'Delete Phase': {
        functionLibraryNodeDeleter.deletePhase(payload.node, workspaceNode.rootNodes)
        break
      }
      case 'Delete Formula': {
        functionLibraryNodeDeleter.deleteFormula(payload.node, workspaceNode.rootNodes)
        break
      }
      case 'Delete Situation': {
        functionLibraryNodeDeleter.deleteSituation(payload.node, workspaceNode.rootNodes)
        break
      }
      case 'Delete Condition': {
        functionLibraryNodeDeleter.deleteCondition(payload.node, workspaceNode.rootNodes)
        break
      }
      case 'Delete Code': {
        functionLibraryNodeDeleter.deleteCode(payload.node, workspaceNode.rootNodes)
        break
      }
      default:

    }
  }

  function download (filename, text) {
    let element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
}
