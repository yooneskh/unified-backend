

export function joinPaths(...paths: string[]) {

  let fullPath = paths[0];

  for (const nextPath of paths.slice(1)) {

    if (!fullPath.endsWith('/')) {
      fullPath += '/';
    }

    fullPath += (nextPath.startsWith('/')) ? (nextPath.slice(1)) : (nextPath);

  }


  return fullPath;

}
