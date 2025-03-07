import fs from 'fs'
import Logging from 'libary/Logging'
import { diskStorage, Options } from 'multer'
import { extname } from 'path'

type validFileExtensionType = 'png' | 'jpg' | 'jpeg'
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg'

const validFileExtension: validFileExtensionType[] = ['png', 'jpg', 'jpeg']
const validMimeType: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg']

export const saveImageToStorage: Options = {
  storage: diskStorage({
    destination: './files',
    filename(req, file, callback) {
      // create unique suffix
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      // Get file extension
      const ext = extname(file.originalname)
      // write file name
      const filename = `${uniqueSuffix}${ext}`

      callback(null, filename)
    },
  }),
  fileFilter(req, file, callback) {
    // Ispravljeno na fileFilter
    const allowedMimeTypes: validMimeType[] = validMimeType
    allowedMimeTypes.includes(file.mimetype as validMimeType) ? callback(null, true) : callback(null, false)
  },
}

export const isFileExtensionSafe = async (fullFilePath: string): Promise<boolean> => {
  // Dinamički import za 'file-type'
  const { fileTypeFromFile } = await import('file-type')

  // Provodi se provera vrste fajla
  const fileExtensionMimeType = await fileTypeFromFile(fullFilePath)

  if (!fileExtensionMimeType?.ext) return false

  const isFileTypeLegit = validFileExtension.includes(fileExtensionMimeType.ext as validFileExtensionType)
  const isMimeTypeLegit = validMimeType.includes(fileExtensionMimeType.mime as validMimeType)
  const isFileLegit = isFileTypeLegit && isMimeTypeLegit

  return isFileLegit
}

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath)
  } catch (error) {
    Logging.error(error)
  }
}
