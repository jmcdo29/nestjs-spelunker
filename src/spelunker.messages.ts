const gitRepoUrl = 'https://github.com/jmcdo29/nestjs-spelunker';
const minWtf = 'https://minimum-reproduction.wtf';

const baseMessage =
  "I'm not sure how you did it, but you got to a point in the code where you shouldn't have been able to reach.";

const newIssue = `Please open a Bug Report here: ${gitRepoUrl}/issues/new.`;
const withMinRepro = `If possible, please provide a minimum reproduction as well: ${minWtf}`;

export const UndefinedClassObject = `
${baseMessage}

Somehow, the \`useClass\` and \`useExisting\` options are both undefined in a
custom provider without a \`useFactory\` or a \`useValue\`.

${newIssue}

${withMinRepro}
`;

export const UndefinedProvider = (provToken: string) => `
${baseMessage}

Somehow the token found for \`${provToken}\` came back as \`undefined\`. No idea how
as this is all coming from Nest's internals in the first place.

${newIssue}

${withMinRepro}
`;
