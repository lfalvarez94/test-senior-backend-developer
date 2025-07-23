export class Name {
  private constructor(private readonly value: string) {}

  static create(value: string): Name {
    if (!value.trim()) {
      throw new Error('El nombre de Flow no puede estar vacío.');
    }
    return new Name(value.trim());
  }
  getValue(): string {
    return this.value;
  }
  equals(other: Name): boolean {
    return this.value === other.value;
  }
}
