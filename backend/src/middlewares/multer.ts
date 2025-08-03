import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/jfif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, and JFIF formats are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
