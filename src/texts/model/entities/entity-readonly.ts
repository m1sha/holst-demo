import { Drawable } from 'holst'
import { Entity } from './entity'

export type EntityReadonly<T extends Drawable> = Readonly<Entity<T>>
