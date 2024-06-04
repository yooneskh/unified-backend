

export function wildcardIncludes(array: string[] | undefined, item: string): boolean {

  if (!array) {
    return false;
  }

  return array.some(it => matchPermission(it, item));

}

function matchPermission(permit: string, permission: string): boolean {

  const permitParts = permit.split('.');
  const permissionParts = permission.split('.');
  const minLength = Math.min(permitParts.length, permissionParts.length);

  for (let index = 0; index < minLength; index++) {

    const curPermission = permissionParts[index];
    const curPermit = permitParts[index];

    if (curPermit.includes('**')) {
      return curPermission.startsWith( curPermit.slice(0, curPermit.indexOf('**')) );
    }
    else if (curPermit.includes('*')) {

      const testReg = new RegExp(`^${curPermit.replaceAll('*', '.+')}$`);

      if (!testReg.test(curPermission)) {
        return false;
      }

    }
    else if (curPermit !== curPermission) {
      return false;
    }

  }

  return permitParts.length === permissionParts.length;

}