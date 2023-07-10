export default function formatFileSize(sizeInBytes) {
  if (sizeInBytes >= 1e9) {
    return (sizeInBytes / 1e9).toFixed(2) + ' gb';
  } else if (sizeInBytes >= 1e6) {
    return (sizeInBytes / 1e6).toFixed(2) + ' mb';
  } else if (sizeInBytes >= 1e3) {
    return (sizeInBytes / 1e3).toFixed(2) + ' kb';
  } else {
    return sizeInBytes + ' b';
  }
}
