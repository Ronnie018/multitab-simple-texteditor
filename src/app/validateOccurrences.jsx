function validateOccurrences(text, target, validPrefixes = ["o", "o "]) {
  const lowerText = text.toLowerCase();
  const lowerTarget = target.toLowerCase();
  const lowerPrefixes = validPrefixes.map(p => p.toLowerCase());

  const regex = new RegExp(lowerTarget, 'g');
  let match;

  while ((match = regex.exec(lowerText)) !== null) {
    const startIndex = match.index;
    const before = lowerText.slice(Math.max(0, startIndex - 10), startIndex);

    const hasValidPrefix = lowerPrefixes.some(prefix => before.endsWith(prefix));

    if (!hasValidPrefix) {
      return false;
    }
  }

  return true;
}

export default validateOccurrences;