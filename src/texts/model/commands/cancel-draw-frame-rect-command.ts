import { MutableAppState } from '../app-state'
import { CreateRasterTool } from '../tools/create-tools/create-raster-tool'
import { Command } from './command'

export class CancelDrawFrameRectCommand extends Command<any> {
  execute (appState: MutableAppState): void {
    const tool = appState.selectedTool() as CreateRasterTool
    tool.clear()
    appState.scene().actionLayer.clear()
    super.execute(appState)
  }
}
