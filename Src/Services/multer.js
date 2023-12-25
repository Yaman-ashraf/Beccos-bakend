import multer from 'multer';

export const fileValidation = {
    image: ['image/jpeg', 'image/png', 'image / webp', 'image / svg+xml'],
    file: ['aplication/pdf'],
}


function fileUpload(customValidation = []) {

    const storage = multer.diskStorage({});//place where i store the pic, not in my lab
    function fileFilter(req, file, cb) {//callBack
        if (customValidation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb("invalid format", false);
        }
    }
    const upload = multer({ fileFilter, storage });
    return upload;
}
export default fileUpload;