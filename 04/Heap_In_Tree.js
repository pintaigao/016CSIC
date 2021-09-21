class Node {
  constructor(priority, value) {
    this.priority = priority;
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Heap_in_Tree {
  constructor() {
    this.root = null;
    this.heap = [];
    this.size = 0;
  }
  
  getHeapList() {
    this.heap = [];
    // BFS Method to travel the tree and get the value
    let arr = [this.root];
    while (arr.length) {
      let node = arr.shift();
      if (!node.left || !node.right) {
        this.heap.push(node);
      }

      if (node.left) {
        arr.push(node.left);
      }

      if (node.right) {
        arr.push(node.right);
      }
    }
  }

  insert(priority, value) {
    this.size += 1;
    
    if (!this.root) {
      this.root = new Node(priority, value);
      this.getHeapList();
    }

    let node = this.heap[0];
    this.heap.push(new Node(priority, value));
    
    if (!node.left) {
      node.left = this.heap[this.heap.length - 1];
    } else if (!node.right) {
      node.right = this.heap[this.heap.length - 1];
      this.heap.shift();
    }

    this.heap[this.heap.length - 1].parent = node;
    this.float(this.heap[this.heap.length - 1]);
    console.log(`${value} with ${priority} priority has been insert into the heap`)
  }
  
  pop() {
    if (!this.root) {
      console.log("Heap is empty");
    }

    let temp = this.heap.pop();
    let peak = this.root.value;
    this.size -= 1;

    if (temp.value === this.root.value) {
      this.root = null;
    } else if (temp.parent.right) {
      temp.parent.right = null;
    } else {
      temp.parent.left = null;
    }

    this.root.value = temp.value;
    this.sink(this.root);
    this.getHeapList();

    console.log(`${peak} has been pop out`);
  }

  float(node) {
    if (!node.parent) {
      return;
    } else if (node.value < node.parent.value) {
      let temp = node.value;
      node.value = node.parent.value;
      node.parent.value = temp;
    }
    this.float(node.parent);
  }

  sink(node) {
    if (!node.left && !node.right) {
      return;
    }

    let minChild = node;

    if (node.left && node.left.value < node.value) {
      minChild = node.left;
    }

    if (node.right && minChild.value > node.right.value) {
      minChild = node.right;
    }

    if (minChild.value === node.value) {
      return;
    }

    if (minChild.value !== node.value) {
      let temp = node.value;
      node.value = minChild.value;
      minChild.value = temp;
      this.sink(minChild);
    }
  }
}

module.exports = Heap_in_Tree;

let heap = new Heap_in_Tree();

for (let num of [4, 8, 7, 2, 9, 13, 14, 10, 5, 1, 3, 12, 6, 11]) {
  heap.insert(num, num);
}

console.log(this.heap.heap)
