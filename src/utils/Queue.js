class Queue {
  constructor() {
    this.length = 0;
    this.elements = [];
  }

  pop() {
    if (this.isEmpty()) {
      return;
    }
    this.length--;
    return this.elements.shift();
  }

  front() {
    if (this.isEmpty()) {
      return;
    }
    return this.elements[0];
  }

  push(element) {
    this.elements.push(element);
    this.length++;
  }

  pushAll(elements = []) {
    elements.map((e) => {
      this.elements.push(e);
      this.length++;
    });
  }

  size() {
    return this.length;
  }

  isEmpty() {
    return this.length === 0 ? true : false;
  }
}

export default Queue;
