import type { DynamicBinaryWriter } from '../DynamicBinaryWriter'

export abstract class AseBase {
  protected children: AseBase[] = []

  abstract writeContent(): [DynamicBinaryWriter, number]

  public addChild(child: AseBase): void {
    this.children.push(child)
  }

  public getChildByType<T extends AseBase>(type: new (...args: any[]) => T): T {
    return this.children.find((child) => child instanceof type) as T
  }

  public getChildByTypeDeep<T extends AseBase>(type: new (...args: any[]) => T): T {
    for (const child of this.children) {
      if (child instanceof type) {
        return child as T
      }
      const foundChild = child.getChildByTypeDeep(type)
      if (foundChild) {
        return foundChild
      }
    }
    return null as unknown as T
  }
}
