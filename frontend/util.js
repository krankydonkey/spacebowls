
export function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, resolve);
  });
}
