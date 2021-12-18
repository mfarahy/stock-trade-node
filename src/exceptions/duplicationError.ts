export default class DuplicationError extends Error {
  constructor(public readonly duplicateKey: any | undefined, message: string | undefined) {
    super(message);
  }
}
