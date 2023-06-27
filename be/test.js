function getNameIndexAndExtension(fileName) {
  const regex = /^(.*?)(?: \((\d+)\))?(\.\w+)?$/;
  const match = fileName.match(regex);

  const name = match[1] || '';
  const index = match[2] ? parseInt(match[2]) : 0;
  const extension = match[3] ? match[3].substring(1) : '';

  return { name, index, ext: extension };
}

const abc = getNameIndexAndExtension('thonguyen (2)     .jpg');
console.log('abc: ', abc);
