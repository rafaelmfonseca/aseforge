import type { DynamicBinaryWriter } from '../DynamicBinaryWriter'

export abstract class AseBase {
  protected children: AseBase[] = []

  abstract writeContent(): [DynamicBinaryWriter, number]

  public addChild(child: AseBase): void {
    this.children.push(child)
  }

  public getChildrenOfType<T extends AseBase>(type: new (...args: any[]) => T): T {
    return this.children.find((child) => child instanceof type) as T
  }
}
