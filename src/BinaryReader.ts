export class BinaryReader {
  private view: DataView
  private offset: number

  constructor(buffer: ArrayBuffer) {
    this.view = new DataView(buffer)
    this.offset = 0
  }

  // DWORD: A 32-bit unsigned integer value
  readDword(): number {
    const value = this.view.getUint32(this.offset, true)
    this.offset += 4
    return value
  }

  // WORD: A 16-bit unsigned integer value
  readWord(): number {
    const value = this.view.getUint16(this.offset, true)
    this.offset += 2
    return value
  }

  // BYTE: An 8-bit unsigned integer value
  readByte(): number {
    const value = this.view.getUint8(this.offset)
    this.offset += 1
    return value
  }

  // SHORT: A 16-bit signed integer value
  readShort(): number {
    const value = this.view.getInt16(this.offset, true)
    this.offset += 2
    return value
  }

  incrementOffset(value: number): void {
    this.offset += value
  }
}
