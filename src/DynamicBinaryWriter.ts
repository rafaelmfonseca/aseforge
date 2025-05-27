import { BinaryWriter } from './BinaryWriter'

type BufferEntryType = 'WORD' | 'DWORD' | 'FIXED' | 'BYTE' | 'STRING' | 'SHORT' | 'PIXEL'
type BufferEntryValue = number | string | [number, number, number, number]

export class BufferEntry {
  protected type: BufferEntryType
  protected size: number
  protected value: BufferEntryValue

  constructor(entry: { type: BufferEntryType; size: number; value: BufferEntryValue }) {
    this.type = entry.type
    this.size = entry.size
    this.value = entry.value
  }

  withValue(value: number): BufferEntry {
    this.value = value
    return this
  }

  getValue(): BufferEntryValue {
    return this.value
  }

  getType(): string {
    return this.type
  }

  getSize(): number {
    return this.size
  }
}

export class DynamicBinaryWriter {
  public buffer: Array<BufferEntry> = []

  // WORD: A 16-bit unsigned integer value
  public writeWord(value: number): BufferEntry {
    const index = this.buffer.push(new BufferEntry({ type: 'WORD', size: 2, value }))
    return this.buffer[index - 1]
  }

  // DWORD: A 32-bit unsigned integer value
  public writeDword(value: number): BufferEntry {
    const index = this.buffer.push(new BufferEntry({ type: 'DWORD', size: 4, value }))
    return this.buffer[index - 1]
  }

  // FIXED: A 32-bit fixed point (16.16) value
  public writeFixed(value: number): BufferEntry {
    const index = this.buffer.push(new BufferEntry({ type: 'FIXED', size: 4, value }))
    return this.buffer[index - 1]
  }

  // BYTE: An 8-bit unsigned integer value
  public writeByte(value: number): BufferEntry {
    const index = this.buffer.push(new BufferEntry({ type: 'BYTE', size: 1, value }))
    return this.buffer[index - 1]
  }

  // STRING:
  // WORD: string length (number of bytes)
  // BYTE[length]: characters (in UTF-8) The '\0' character is not included.
  public writeString(value: string): BufferEntry {
    const index = this.buffer.push(
      new BufferEntry({ type: 'STRING', size: 2 + value.length, value }),
    )
    return this.buffer[index - 1]
  }

  // BYTE[n]: "n" bytes.
  public writeBytes(value: number[]): void {
    for (const byte of value) {
      this.writeByte(byte)
    }
  }

  // SHORT: A 16-bit signed integer value
  public writeShort(value: number): BufferEntry {
    const index = this.buffer.push(new BufferEntry({ type: 'SHORT', size: 2, value }))
    return this.buffer[index - 1]
  }

  // PIXEL: One pixel, depending on the image pixel format:
  // RGBA: BYTE[4], each pixel have 4 bytes in this order Red, Green, Blue, Alpha.
  public writePixel(red: number, green: number, blue: number, alpha: number): BufferEntry {
    const index = this.buffer.push(
      new BufferEntry({ type: 'PIXEL', size: 4, value: [red, green, blue, alpha] }),
    )
    return this.buffer[index - 1]
  }

  public toArrayBuffer(): ArrayBuffer {
    const writer = new BinaryWriter()
    for (const entry of this.buffer) {
      switch (entry.getType()) {
        case 'WORD':
          writer.writeWord(entry.getValue() as number)
          break
        case 'DWORD':
          writer.writeDword(entry.getValue() as number)
          break
        case 'FIXED':
          writer.writeFixed(entry.getValue() as number)
          break
        case 'BYTE':
          writer.writeByte(entry.getValue() as number)
          break
        case 'SHORT':
          writer.writeShort(entry.getValue() as number)
          break
        case 'STRING':
          writer.writeString(entry.getValue() as string)
          break
        case 'PIXEL':
          const pixel = entry.getValue() as number[]
          writer.writePixel(pixel[0], pixel[1], pixel[2], pixel[3])
          break
        default:
          throw new Error(`Unknown entry type: ${entry.getType()}`)
      }
    }
    return writer.getArrayBuffer()
  }

  public copyFrom(writer: DynamicBinaryWriter): void {
    for (const entry of writer.buffer) {
      this.buffer.push(entry)
    }
  }

  public getSize(): number {
    return this.buffer.reduce((total, entry) => total + entry.getSize(), 0)
  }
}
