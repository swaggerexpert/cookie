import { identifiers, utilities } from 'apg-lite';

const cookiePair = (state, chars, phraseIndex, phraseLength, data) => {
  if (state === identifiers.SEM_PRE) {
    data.push(['cookie-pair', utilities.charsToString(chars, phraseIndex, phraseLength)]);
  } else if (state === identifiers.SEM_POST) {
    /* not used in this example */
  }
  return identifiers.SEM_OK;
};

export default cookiePair;