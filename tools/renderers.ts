

export function renderHandlebarTemplate(template: string, data: Record<string, unknown>) {

  let result = template;

  for (const entry of Object.entries(data)) {
    result = result.replace(new RegExp(`{{\\s*${entry[0]}\\s*}}`, 'g'), String(entry[1]));
  }

  return result;

}
