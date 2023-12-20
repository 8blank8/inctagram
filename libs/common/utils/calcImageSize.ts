/* eslint-disable */
const calcImageSize = (width: number, height: number, divider = 250) => {
  const highest = width > height ? 'width' : 'height';
  const rate = highest === 'width' ? height / width : width / height;

  if (highest === 'width') {
    return {
      width: divider,
      height: Number((divider * rate).toFixed(0)),
    };
  }
  return {
    width: Number((divider * rate).toFixed(0)),
    height: divider,
  };
};

export default calcImageSize;
