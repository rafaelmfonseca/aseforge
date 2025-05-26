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

  // FIXED: A 32-bit fixed point (16.16) value
  readFixed(): number {
    const value = this.view.getInt32(this.offset, true)
    this.offset += 4
    return value / 65536 // Convert to float
  }

  // WORD: string length (number of bytes)
  // BYTE[length]: characters (in UTF-8) The '\0' character is not included.
  readString(length: number): string {
    const bytes = new Uint8Array(this.view.buffer, this.offset, length)
    this.offset += length
    return new TextDecoder().decode(bytes)
  }

  incrementOffset(value: number): void {
    this.offset += value
  }
}
