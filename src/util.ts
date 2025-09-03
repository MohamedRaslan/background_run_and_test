export const actionConsoleLog = (
  //cyan = (36, 39);
  //cyanBright = (96, 39);
  //bgCyan = (46, 49);
  //bgCyanBright = (106, 49);
  message: string,
  open = 36,
  close = 39
): void => console.log(`\u001B[${open}m ${message} \u001B[${close}m`)
