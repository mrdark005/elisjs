class Collection<K, V> extends Map<K, V> {
  array() {
    return Array.from(this.values());
  }

  keyArray() {
    return Array.from(this.keys());
  }

  find(cb: (value: V, index: number, array: V[]) => boolean) {
    return this.array().find(cb);
  }

  filter(cb: (value: V, index: number, array: V[]) => boolean) {
    return this.array().filter(cb);
  }

  some(cb: (value: V, index: number, array: V[]) => boolean) {
    return this.array().some(cb);
  }

  map(cb: (value: V, index: number, array: V[]) => any) {
    return this.array().map(cb);
  }

  // TODO: integrate util.inspect() to detect the objects.
  at(value: V) {
    const data = this.find((v) => v == value);
    return data ? this.array().indexOf(data) : -1;
  }
}

export default Collection;
