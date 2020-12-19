import {deflate} from 'zlib'
import Jimp from 'jimp'

// если .format === 'jpg', у объекта есть дополнительное числовое свойство quality
// если .format === 'png', дополнительных свойств нет
export type ConversionOptions = 
  | {format: 'jpg', quality: 99 | 90 | 75 | 50}
  | {format: 'png'}
  | {format: 'deflate'}

export type CompressionInfo = {
  size: number;
  compressedSize: number;
  compressionRatio: number;
}

function deflateAsync(input: string | ArrayBuffer | NodeJS.ArrayBufferView) {
  return new Promise<Buffer>((resolve, reject) => {
    deflate(input, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

export async function convert(filename: string, options: ConversionOptions): Promise<CompressionInfo> {

  // пример загрузки изображения, конвертации в буфер и оценки размера
  const bikeBmp = await Jimp.read(filename)

  const bmpBuffer = await bikeBmp.getBufferAsync(Jimp.MIME_BMP)
  const bmpSize = bmpBuffer.byteLength


  if (options.format === 'jpg') {
    const {quality} = options
    const jpegBuffer = await bikeBmp.quality(quality).getBufferAsync(Jimp.MIME_JPEG)
    const jpegSize = jpegBuffer.byteLength

    return {
      size: bmpSize,
      compressedSize: jpegSize,
      compressionRatio: jpegSize / bmpSize
    }
  } else if (options.format === 'png') {
    const pngBuffer = await bikeBmp.getBufferAsync(Jimp.MIME_PNG)
    const pngSize = pngBuffer.byteLength

    return {
      size: bmpSize,
      compressedSize: pngSize,
      compressionRatio: pngSize / bmpSize
    }
  } else {
    const deflateBuffer = await deflateAsync(bmpBuffer.buffer)
    const deflateSize = deflateBuffer.byteLength

    return {
      size: bmpSize,
      compressedSize: deflateSize,
      compressionRatio: deflateSize / bmpSize
    }
  }
}

export async function pngAndDeflate(filename: string): Promise<CompressionInfo> {
  const bikeBmp = await Jimp.read(filename)

  const bmpBuffer = await bikeBmp.getBufferAsync(Jimp.MIME_BMP)
  const bmpSize = bmpBuffer.byteLength
  const pngBuffer = await bikeBmp.getBufferAsync(Jimp.MIME_PNG)
  const deflatePngBuffer = await deflateAsync(pngBuffer.buffer)
  const deflateSize = deflatePngBuffer.byteLength

  return {
    size: bmpSize,
    compressedSize: deflateSize,
    compressionRatio: deflateSize / bmpSize
  }
}
