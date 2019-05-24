
function newStrategySpace () {
  const MODULE_NAME = 'Strategy Space'
  let thisObject = {
    sidePanel: undefined,
    strategizerGateway: undefined,
    container: undefined,
    iconCollection: undefined,
    iconByPartType: undefined,
    workspace: undefined,
    isInitialized: false,
    physics: physics,
    draw: draw,
    getContainer: getContainer,
    makeVisible: makeVisible,
    makeInvisible: makeInvisible,
    initialize: initialize
  }

  let container = newContainer()
  container.initialize()
  thisObject.container = container

  container.isDraggeable = false

  thisObject.iconCollection = new Map()
  thisObject.iconByPartType = new Map()

  return thisObject

  async function initialize () {
    loadIconCollection()
    buildIconByPartTypeMap()

    thisObject.strategizerGateway = newStrategizerGateway()
    thisObject.strategizerGateway.initialize()

    let savedWorkspace = window.localStorage.getItem('workspace')
    if (savedWorkspace === null) {
      await thisObject.strategizerGateway.loadFromStrategyzer()
      if (thisObject.strategizerGateway.strategizerData !== undefined) {
        thisObject.isInitialized = true
        thisObject.workspace = newWorkspace()
        thisObject.workspace.initialize(thisObject.strategizerGateway.strategizerData)
      }
    } else {
      thisObject.isInitialized = true
      thisObject.workspace = newWorkspace()
      thisObject.workspace.initialize()
    }
  }

  function buildIconByPartTypeMap () {
    const relationshipArray = [
      ['Trading System', 'analysis'],
      ['Strategy', 'quality'],
      ['Trigger On Event', 'startup'],
      ['Trigger Off Event', 'support'],
      ['Take Position Event', 'compass'],
      ['Stop', 'pixel'],
      ['Take Profit', 'competition'],
      ['Phase', 'placeholder'],
      ['Situation', 'pyramid'],
      ['Condition', 'testing']
    ]

    for (let i = 0; i < relationshipArray.length; i++) {
      let record = relationshipArray[i]
      let icon = thisObject.iconCollection.get(record[1])
      thisObject.iconByPartType.set(record[0], icon)
    }
  }

  function loadIconCollection () {
    const iconsNames = [
      'analysis',
      'analysis-1',
      'approve',
      'attach',
      'attractive',
      'pyramid',
      'brainstorming',
      'broken-link',
      'chat',
      'chronometer',
      'compass',
      'competition',
      'content',
      'design-tool',
      'grid',
      'headphones',
      'html',
      'image',
      'layout',
      'loading',
      'login',
      'pantone',
      'paper-plane',
      'photo-camera',
      'piggy-bank',
      'pipette',
      'pixel',
      'placeholder',
      'planning',
      'promotion',
      'pyramid',
      'quality',
      'responsive',
      'schedule',
      'search',
      'security',
      'settings',
      'sitemap',
      'startup',
      'support',
      'tap',
      'target',
      'targeting',
      'task',
      'testing',
      'text',
      'timeline',
      'tools',
      'trash',
      'upload',
      'vector',
      'video-player'
    ]

    for (let i = 0; i < iconsNames.length; i++) {
      let name = iconsNames[i]
      loadImage(name)
    }

    function loadImage (name) {
      const PATH = 'Images/Icons/style-01/'
      let image = new Image()
      image.onload = onImageLoad
      image.fileName = name

      function onImageLoad () {
        image.canDrawIcon = true
      }
      image.src = window.canvasApp.urlPrefix + PATH + name + '.png'
      thisObject.iconCollection.set(name, image)
    }
  }

  function physics () {
    if (visible !== true) { return }
    thisObject.workspace.physics()
  }

  function makeVisible () {
    canvas.floatingSpace.makeVisible()
    visible = true
  }

  function makeInvisible () {
    visible = false
  }

  function getContainer (point) {
    let container

    if (thisObject.strategizerGateway !== undefined) {
      container = thisObject.strategizerGateway.getContainer(point)
      if (container !== undefined) { return container }
    }

    if (thisObject.sidePanel !== undefined) {
      container = thisObject.sidePanel.getContainer(point)
      if (container !== undefined) { return container }
    }

    return
  }

  function draw () {
    if (thisObject.sidePanel !== undefined) {
      thisObject.sidePanel.draw()
    }
  }
}

