import { BinaryWriter } from './BinaryWriter'

export class BufferEntry {
  protected type: string
  protected size: number
  protected value: number

  constructor(entry: { type: string; size: number; value: number }) {
    this.type = entry.type
    this.size = entry.size
    this.value = entry.value
  }

  withValue(value: number): BufferEntry {
    this.value = value
    return this
  }

  getValue(): number {
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

  public toUint8Array(): ArrayBuffer {
    const writer = new BinaryWriter()
    for (const entry of this.buffer) {
      switch (entry.getType()) {
        case 'WORD':
          writer.writeWord(entry.getValue())
          break
        case 'DWORD':
          writer.writeDword(entry.getValue())
          break
        case 'FIXED':
          writer.writeFixed(entry.getValue())
          break
        case 'BYTE':
          writer.writeByte(entry.getValue())
          break
        case 'SHORT':
          writer.writeShort(entry.getValue())
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
