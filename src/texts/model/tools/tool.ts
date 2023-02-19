import { Drawable } from 'holst'
import { KeyboardEventDecorator, MouseEventDecorator } from 'holst/src/core/events/decorators'
import { InteractiveEvent } from 'holst/src/core/events/interactive'
import { MouseCursorTypes } from 'holst/src/core/events/mouse-cursor-types'
import { Component } from '../../components/base/component'
import { AppState } from '../app-state'

type ManipulationToolNames = 'select' | 'move' | 'rotate' | 'transform'
type CreateEntityToolNames = 'create-text' | 'create-sketch' | 'create-raster'
type RasterToolNames = 'raster-pen' | 'raster-brush' | 'raster-polygon' | 'raster-shape' | 'raster-fill' | 'raster-eraser'

export type ToolNames = ManipulationToolNames | CreateEntityToolNames | RasterToolNames
export abstract class Tool {
  abstract get name (): ToolNames
  get cursor (): MouseCursorTypes { return 'default' }

  mousedown (e: InteractiveEvent<MouseEventDecorator>, drawable: Drawable, state: AppState, component: Component<HTMLElement>): void {}
  mousemove (e: InteractiveEvent<MouseEventDecorator>, drawable: Drawable, state: AppState, component: Component<HTMLElement>): void {}
  mouseup (e: InteractiveEvent<MouseEventDecorator>, drawable: Drawable, state: AppState, component: Component<HTMLElement>): void {}
  click (e: InteractiveEvent<MouseEventDecorator>, drawable: Drawable, state: AppState, component: Component<HTMLElement>): void {}
  keydown (e: InteractiveEvent<KeyboardEventDecorator>, drawable: Drawable, state: AppState, component: Component<HTMLElement>): void {}
}
