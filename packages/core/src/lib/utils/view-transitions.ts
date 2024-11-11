export function supportsViewTransitionsAPI(doc?: Document) {
  doc = doc ?? document;
  if (doc == null) return false;
  return typeof (doc as never)['startViewTransition'] === 'function';
}
