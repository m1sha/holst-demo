import { Drawable } from 'holst'
import { MouseEventDecorator } from 'holst/src/core/events/decorators'
import { InteractiveEvent } from 'holst/src/core/events/interactive'
import { Component } from '../../../components/base/component'
import { AppState } from '../../app-state'
import { Tool, ToolNames } from '../tool'
import { SelectEntitiesCommand } from '../../../model/commands/entities/select/select-entities-command'
import { Background } from '../../entities/background'
import { DeselectAllEntitiesCommand } from '../../commands/entities/select/deselect-all-entities-command'

export class SelectTool extends Tool {
  mousedown (e: InteractiveEvent<MouseEventDecorator>, drawable: Drawable, state: AppState, component: Component<HTMLElement>) {
    e.event.stopPropagation()
    if (drawable instanceof Background) {
      state.sendCommand(component, new DeselectAllEntitiesCommand())
      return
    }
    state.sendCommand(component, new SelectEntitiesCommand([drawable.id], 'none'))
  }

  mousemove (e: InteractiveEvent<MouseEventDecorator>, drawable: Drawable, state: AppState, component: Component<HTMLElement>) {
    // throw new Error('Method not implemented.')
  }

  mouseup (e: InteractiveEvent<MouseEventDecorator>, drawable: Drawable, state: AppState, component: Component<HTMLElement>) {
    // throw new Error('Method not implemented.')
  }

  get name (): ToolNames { return 'select' }
}
