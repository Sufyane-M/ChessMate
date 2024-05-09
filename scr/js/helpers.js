export const stringToBool = (string) => {
  if (string === '0') {
    return false;
  }
  if (string === '1') {
    return true;
  }
  return null;
};
