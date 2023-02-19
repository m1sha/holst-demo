import { Drawable, IPoint, Layer, Scene } from 'holst'
import { MouseCursorTypes } from 'holst/src/core/events/mouse-cursor-types'
import { Component } from '../components/base/component'
import { AddedEntityCommand } from './commands/entities/added-entity-command'
import { Command } from './commands/command'
import { Commander } from './commands/commander'
import { Entity } from './entities/entity'
import { EntitiesStorage } from './storage'
import { defineStyles } from './styles'
import { SelectTool } from './tools/manipulation-tools/select-tool'
import { Tool, ToolNames } from './tools/tool'
import { ToolBox } from './tools/tool-box'
import { Background } from './entities/background'

/* eslint no-use-before-define: "off" */
type CommandInvokerCallback = (sender: Component<HTMLElement> | AppState, command: Command<any>) => void

export interface MutableAppState {
  scene: () => Scene
  defaultCursor: () => MouseCursorTypes
  selectedTool: () => Tool
  selectedLayer: () => Layer
  selectedEntities: () => Entity<Drawable>[]
  currentTextPosition: () => IPoint
  currentText: () => string
  storage: () => EntitiesStorage
  clearSelected: () => void
  setDefaultCursor: (cursor: MouseCursorTypes) => void
  setTool: (toolName: ToolNames) => void
  setCurrentTextPosition: (point: IPoint) => void
  setCurrentText: (text: string) => void
  background: () => Background
  addEntities: (entities: Entity<Drawable>[]) => void
}

export class AppState {
  #commander: Commander = new Commander()
  #scene: Scene | null = null
  #defaultCursor: MouseCursorTypes = 'default'
  #selectedTool: Tool = new SelectTool()
  #selectedLayer: Layer | null = null
  #selectedEntities: Entity<Drawable>[] = []
  #currentTextPosition: IPoint = { x: 0, y: 0 }
  #currentText: string = ''
  #storage: EntitiesStorage = new EntitiesStorage()
  #toolBox: ToolBox
  private invokers: CommandInvokerCallback[] = []
  background: Background

  constructor () {
    this.#toolBox = new ToolBox()
    const layer0 = this.scene.createLayer()
    this.background = new Background(layer0)
    this.addInvoker((sender, command) => this.onStateChanged(sender, command))
  }

  get defaultCursor () { return this.#defaultCursor }

  get selectedTool () { return this.#selectedTool }

  get selectedLayer () {
    if (this.#selectedLayer) return this.#selectedLayer
    return (this.#selectedLayer = this.scene.createLayer())
  }

  get selectedEntities () { return this.#selectedEntities }

  get scene () {
    if (!this.#scene) { this.#scene = new Scene(); defineStyles(this.#scene) }
    return this.#scene
  }

  get entities (): Array<Entity<Drawable>> {
    return this.#storage.entities
  }

  get currentTextPosition () {
    return this.#currentTextPosition
  }

  get currentText (): string {
    return this.#currentText
  }

  sendCommand (sender: Component<HTMLElement> | AppState, command: Command<any>): void { this.invokers.forEach(p => p(sender, command)) }

  addInvoker (callback: CommandInvokerCallback) { this.invokers.push(callback) }

  addEntities (entities: Entity<Drawable>[]) {
    entities.forEach(item => {
      this.sendCommand(this, new AddedEntityCommand(item))
    })
  }

  undo () {
    const command = this.#commander.command
    this.#commander.undo(this.mutable)
    this.sendCommand(this, command)
  }

  redo () {
    const command = this.#commander.command
    this.#commander.redo(this.mutable)
    this.sendCommand(this, command)
  }

  private onStateChanged (sender: AppState | Component<HTMLElement>, command: Command<any>): void {
    if (!this.#commander.has(command)) this.#commander.add(command)
    if (command.canExecuted) command.execute(this.mutable)
    this.#storage.refresh()
  }

  private get mutable (): MutableAppState {
    return {
      currentText: () => this.#currentText,
      currentTextPosition: () => this.#currentTextPosition,
      scene: () => this.#scene!,
      defaultCursor: () => this.defaultCursor,
      selectedEntities: () => this.#selectedEntities,
      selectedLayer: () => this.selectedLayer,
      selectedTool: () => this.#selectedTool,
      storage: () => this.#storage,
      clearSelected: () => (this.#selectedEntities = []),
      setDefaultCursor: cursor => (this.#defaultCursor = cursor),
      setTool: toolName => (this.#selectedTool = this.#toolBox.getByName(toolName)),
      setCurrentTextPosition: point => (this.#currentTextPosition = point),
      setCurrentText: text => (this.#currentText = text),
      background: () => this.background,
      addEntities: entities => this.addEntities(entities)
    }
  }
}
