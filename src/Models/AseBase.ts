import type { DynamicBinaryWriter } from '../DynamicBinaryWriter'

export abstract class AseBase {
  protected children: AseBase[] = []

  abstract writeContent(): [DynamicBinaryWriter, number]

  public addChild(child: AseBase): void {
    this.children.push(child)
  }
}
