// https://github.com/aseprite/aseprite/blob/main/docs/ase-file-specs.md

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
oldAsePaletteChunk.addColor(0, 0, 0)
oldAsePaletteChunk.addColor(34, 32, 52)
oldAsePaletteChunk.addColor(69, 40, 60)
oldAsePaletteChunk.addColor(102, 57, 49)
oldAsePaletteChunk.addColor(143, 86, 59)
oldAsePaletteChunk.addColor(223, 113, 38)
oldAsePaletteChunk.addColor(217, 160, 102)
oldAsePaletteChunk.addColor(238, 195, 154)
oldAsePaletteChunk.addColor(251, 242, 54)
oldAsePaletteChunk.addColor(153, 229, 80)
oldAsePaletteChunk.addColor(106, 190, 48)
oldAsePaletteChunk.addColor(55, 148, 110)
oldAsePaletteChunk.addColor(75, 105, 47)
oldAsePaletteChunk.addColor(82, 75, 36)
oldAsePaletteChunk.addColor(50, 60, 57)
oldAsePaletteChunk.addColor(63, 63, 116)
oldAsePaletteChunk.addColor(48, 96, 130)
oldAsePaletteChunk.addColor(91, 110, 225)
oldAsePaletteChunk.addColor(99, 155, 255)
oldAsePaletteChunk.addColor(95, 205, 228)
oldAsePaletteChunk.addColor(203, 219, 252)
oldAsePaletteChunk.addColor(255, 255, 255)
oldAsePaletteChunk.addColor(155, 173, 183)
oldAsePaletteChunk.addColor(132, 126, 135)
oldAsePaletteChunk.addColor(105, 106, 106)
oldAsePaletteChunk.addColor(89, 86, 82)
oldAsePaletteChunk.addColor(118, 66, 138)
oldAsePaletteChunk.addColor(172, 50, 50)
oldAsePaletteChunk.addColor(217, 87, 99)
oldAsePaletteChunk.addColor(215, 123, 186)
oldAsePaletteChunk.addColor(143, 151, 74)
oldAsePaletteChunk.addColor(138, 111, 48)
oldAsePaletteChunk.addColor(255, 0, 0)
aseFrame.addChild(oldAsePaletteChunk)

const aseLayerChunk = new AseLayerChunk()
aseFrame.addChild(aseLayerChunk)

aseHeader.addChild(aseFrame)

document
  .querySelector<HTMLButtonElement>('#decompileBinFile')!
  .addEventListener('click', async () => {
    logs.innerHTML = ''
    const arrayBuffer = aseHeader.writeContent()[0].toUint8Array()
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
