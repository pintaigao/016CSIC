class Node {
  constructor(data, next, prev) {
    this.data = data;
    this.next = next;
    this.prev = prev;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.count = 0;
  }
  
  append(data) {
    let new_node = new Node(data, null, null)
    if (!this.head) {
      this.head = new_node;
      this.tail = new_node;
    } else {
      new_node.prev = this.tail;
      this.tail.next = new_node;
      this.tail = new_node;
    }
    
    this.count += 1;
  }
  
  iter() {
    let current = this.head;
    let result = [];
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }
  
  reverse_iter() {
    let current = this.tail;
    let result = [];
    while (current && current.prev) {
      result.push(current.data);
      current = current.prev;
    }
    
    return result;
  }
  
  
  delete(data) {
    let current = this.head
    let node_deleted = false
    if (!current) {
      node_deleted = false
    } else if (current.data === data) {
      this.head = current.next
      this.head.prev = null
      node_deleted = true
    } else if (this.tail.data === data) {
      this.tail = self.tail.prev
      this.tail.next = undefined
      node_deleted = true
    } else {
      while (current) {
        if (current.data === data) {
          current.prev.next = current.next
          current.next.prev = current.prev
          node_deleted = true;
        }
        current = current.next
      }
    }
    
    if (node_deleted) {
      this.count -= 1;
    }
  }
  
  
  search(data) {
    for (let node of this.iter()) {
      if (data === node) {
        return true
      }
    }
    
    return false;
  }
  
  
  print_forward() {
    for (let node of this.iter()) {
      console.log(node);
    }
  }
  
  print_backward() {
    let current = this.tail
    while (current) {
      console.log(current.data);
      current = current.prev
    }
  }
  
  
  insert_head(data) {
    if (this.head) {
      let new_node = new Node(data, null, null)
      new_node.next = this.head;
      this.head.prev = new_node
      this.head = new_node
      this.count += 1
    } else {
      this.head = new Node(data, null, null);
      this.count += 1
    }
  }
  
  reverse() {
    let current = this.head;
    while (current) {
      let temp = current.next;
      current.next = current.prev;
      current.prev = temp;
      current = current.prev;
    }
    
    let temp = this.head;
    this.head = this.tail;
    this.tail = temp;
  }
  
  getItem(index) {
    if (index > this.count - 1) {
      console.log("Index out of range.");
    }
    
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = this.head;
    }
    return current.data;
  }
  
  _setItem(index, value) {
    if (index > this.count - 1) {
      console.log("Index out of range.");
    }
    
    let current = this.head
    for (let i = 0; i < index; i++) {
      current = current.next
    }
    current.data = value;
  }
}

module.exports = DoublyLinkedList;
