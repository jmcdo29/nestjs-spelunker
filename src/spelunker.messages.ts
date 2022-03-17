import { style } from '@ogma/styler';

const gitRepoUrl = 'https://github.com/jmcdo29/nestjs-spelunker';
const minWtf = 'https://minimum-reproduction.wtf';

const baseMessage = style.whiteBg.black.apply(
  "I'm not sure how you did it, but you got to a point in the code where you shouldn't have been able to reach.",
);

const newIssue = style.bBlue.apply(
  `Please open a Bug Report here: ${gitRepoUrl}/issues/new.`,
);
const withMinRepro = style.cyan.apply(
  `If possible, please provide a minimum reproduction as well: ${minWtf}`,
);

export const UndefinedClassObject = `
${baseMessage}

Somehow, the ${style.bold.apply('useClass')} and ${style.bold.apply(
  'useExisting',
)} options are both ${style.red.bold.apply(
  'undefined',
)} in a custom provider without a ${style.bold.apply(
  'useFactory',
)} or a ${style.bold.apply('useValue')}.


${newIssue}

${withMinRepro}
`;

export const UndefinedProvider = (provToken: string) => `
${baseMessage}

Somehow the token found for "${style.yellow.apply(
  provToken,
)}" came back as ${style.red.bold.apply(
  'undefined',
)}. No idea how as this is all coming from Nest's internals in the first place.

${newIssue}

${withMinRepro}
`;

export const InvalidCircularModule = (moduleName: string) =>
  `The module "${style.yellow.apply(
    moduleName,
  )}" is trying to import an undefined module. Do you have an unmarked circular dependency?`;
