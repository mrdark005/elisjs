class Collection<K, V> extends Map<K, V> {
  array(): V[] {
    return Array.from(this.values());
  }

  keyArray(): K[] {
    return Array.from(this.keys());
  }
}

export default Collection;
