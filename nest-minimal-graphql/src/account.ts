export class InvalidAccountDisplayNameError extends Error {
  constructor() {
    super("Account display name must not be blank");
  }
}

export class Account {
  readonly displayName: string;

  constructor(
    readonly id: string,
    displayName: string,
  ) {
    const trimmed = displayName.trim();
    if (!trimmed) throw new InvalidAccountDisplayNameError();
    this.displayName = trimmed;
  }

  changeDisplayName(displayName: string): Account {
    return new Account(this.id, displayName);
  }
}
