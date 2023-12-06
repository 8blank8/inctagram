/* eslint-disable */
export const editFileName = (req, file, callback) => {
  const [name, ...rest] = file.originalname.split('.');
  const fileExtName = rest[rest.length - 1];
  const fileName = name.replace(/\s/g, '');
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${fileName}.${fileExtName}`);
};
