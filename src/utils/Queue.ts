export default class Queue<T> {
  private elements: T[] = [];
  private _length: number = 0;

  pop(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    this._length--;
    return this.elements.shift();
  }

  front(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.elements[0];
  }

  push(element: T): void {
    this.elements.push(element);
    this._length++;
  }

  pushAll(elements: T[]): void {
    elements.forEach((e) => {
      this.elements.push(e);
      this._length++;
    });
  }

  size(): number {
    return this._length;
  }

  isEmpty(): boolean {
    return this._length === 0;
  }
}
