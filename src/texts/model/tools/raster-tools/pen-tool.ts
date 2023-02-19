import { Color } from 'holst'
import { Drawable } from 'holst/src/core/drawable'
import { MouseEventDecorator } from 'holst/src/core/events/decorators'
import { InteractiveEvent } from 'holst/src/core/events/interactive'
import { Raster } from 'holst/src/core/raster'
import { Component } from '../../../components/base/component'
import { AppState } from '../../app-state'
import { Tool, ToolNames } from '../tool'
export class PenTool extends Tool {
  private startDraw: boolean = false
  mousedown (e: InteractiveEvent<MouseEventDecorator>, drawable: Drawable, state: AppState, component: Component<HTMLElement>) {
    if (!(drawable instanceof Raster)) return
    if (this.startDraw) return
    this.startDraw = true
    const p = { x: e.event.origin.offsetX, y: e.event.origin.offsetY }
    drawable.canvas.penStart(p)
  }

  mousemove (e: InteractiveEvent<MouseEventDecorator>, drawable: Drawable, state: AppState, component: Component<HTMLElement>) {
    if (!(drawable instanceof Raster)) return
    if (!this.startDraw) return
    const p = { x: e.event.origin.offsetX, y: e.event.origin.offsetY }
    drawable.canvas.penMove(p)
    // drawable.setData(drawable.canvas.data)
    drawable.combine(drawable.canvas.data, Color.black)
    // state.selectedLayer.addRaster()
  }

  mouseup (e: InteractiveEvent<MouseEventDecorator>, drawable: Drawable, state: AppState, component: Component<HTMLElement>) {
    this.startDraw = false
  }

  get name (): ToolNames { return 'raster-pen' }
}
