export function supportsViewTransitions(doc?: Document) {
  doc = doc || document;
  if (doc == null) return false;
  return (doc as never)['startViewTransition'] != null;
}
