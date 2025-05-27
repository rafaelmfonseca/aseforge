export function loadFile(path: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', path, true)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.response)
      } else {
        reject(new Error(`Failed to load file: ${xhr.statusText}`))
      }
    }
    xhr.onerror = function () {
      reject(new Error('Network error'))
    }
    xhr.send()
  })
}

export function loadImageData(src: string): Promise<ImageData> {
  return new Promise<ImageData>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = src
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0)
      resolve(ctx.getImageData(0, 0, img.width, img.height))
    }
    img.onerror = (error) => {
      reject(error)
    }
  })
}
