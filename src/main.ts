// https://github.com/aseprite/aseprite/blob/main/docs/ase-file-specs.md

import { AseCelChunk } from './Models/AseCelChunk'
import { AseColorProfileChunk } from './Models/AseColorProfileChunk'
import { AseFrame } from './Models/AseFrame'
import { AseHeader } from './Models/AseHeader'
import { AseLayerChunk } from './Models/AseLayerChunk'
import { AseOldPaletteChunk } from './Models/AseOldPaletteChunk'
import { decompileAseFile } from './page1'
import { loadFile } from './utils'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div style="dislay: flex; flex-direction: column; gap: 10px;">
    <button id="decompileAseFile">Decompile Aseprite File</button>
    <button id="decompileBinFile">Decompile Binary File</button>
  </div>
  <div id="logs"></div>
`

const logs = document.querySelector<HTMLDivElement>('#logs')!

function log(message: string) {
  const p = document.createElement('p')
  p.innerHTML = message
  p.style.lineHeight = '0.4'
  logs.appendChild(p)
}

const aseHeader = new AseHeader()

const aseFrame = new AseFrame()
aseFrame.addChild(new AseColorProfileChunk())

const oldAsePaletteChunk = new AseOldPaletteChunk()
oldAsePaletteChunk.addColor(255, 0, 0)
oldAsePaletteChunk.addColor(0, 255, 0)
oldAsePaletteChunk.addColor(0, 0, 255)
aseFrame.addChild(oldAsePaletteChunk)

const aseLayerChunk = new AseLayerChunk()
aseFrame.addChild(aseLayerChunk)

const aseCelChunk = new AseCelChunk()
aseFrame.addChild(aseCelChunk)

aseHeader.addChild(aseFrame)

document
  .querySelector<HTMLButtonElement>('#decompileBinFile')!
  .addEventListener('click', async () => {
    logs.innerHTML = ''
    const [writer, size] = aseHeader.writeContent()
    // download file
    const arrayBuffer = writer.toArrayBuffer()
    const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample2.aseprite'
    document.body.appendChild(a)
    a.click()
    decompileAseFile(arrayBuffer, log)
  })

document
  .querySelector<HTMLButtonElement>('#decompileAseFile')!
  .addEventListener('click', async () => {
    logs.innerHTML = ''
    const file = await loadFile('sample.aseprite')
    const arrayBuffer = await file.arrayBuffer()
    decompileAseFile(arrayBuffer, log)
  })
