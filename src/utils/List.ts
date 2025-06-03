export class List<T> {
  private list: T[] = [];

  add(element: T): void {
    this.list.push(element);
  }

  addAll(elements: T[]): void {
    for (let elem of elements) {
      this.list.push(elem);
    }
  }

  pop(index: number): T {
    const element = this.list[index];
    this.list = this.list.filter((elem) => elem !== element);
    return element;
  }

  get(index: number): T {
    return this.list[index];
  }

  get elements(): T[] {
    return this.list;
  }

  isEmpty(): boolean {
    return this.list.length === 0;
  }

  clean(): void {
    this.list = [];
  }

  size(): number {
    return this.list.length;
  }
}
