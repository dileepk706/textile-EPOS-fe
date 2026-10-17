export function formatCamelCase(input: string) {
  if (typeof input === 'string') {
    let formattedString = input.replace(/([a-z])([A-Z])/g, '$1 $2');
    formattedString = formattedString.replace(/\b\w/g, (match) => match.toUpperCase());
    return formattedString;
  } else {
    return input;
  }
}

export const formatHyphenStringV2 = (s: string) => s;
