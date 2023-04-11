import multer from 'multer'

const storage = multer.diskStorage({})
export const uploader = multer({ storage })
