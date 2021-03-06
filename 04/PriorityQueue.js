const Heap = require('./Heap_In_Tree')

class PriorityQueue {
  constructor() {
    this.heap = new Heap();
  }
  
  enqueue(value) {
    return this.heap.insert(value)
  }
  
  peak() {
    console.log(`The peak is: ${this.heap.root.value}`)
  }
  
  dequeue() {
    this.heap.pop()
  }
  
  size() {
    console.log(`The size is: ${this.heap.size}`)
  }
  
  printHeap() {
    console.log(`The Heap is: ${this.heap.printHeap()}`);
  }
  
  isEmpty() {
    if (this.heap.size === 0) {
      console.log("The Heap is Empty")
    } else {
      console.log("The Heap is not Empty")
    }
  }
}

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
let pq = new PriorityQueue();

readline.setPrompt('What would you like to do? \n 1.Enqueue \n 2.Dequeue \n 3.Print-Size \n 4.Print-Peak \n 5.Is-Empty \n 6.Print-Heap \n 7.Exit \n');
readline.prompt();
readline.on('line', function (line) {
  let command = line.trim().split(" ")[0];
  let params = line.trim().split(" ")[1];
  switch (command) {
    case 'Enqueue':
      pq.enqueue(parseInt(params));
      break;
    case 'Dequeue':
      pq.dequeue();
      break
    case 'Print-Size':
      pq.size();
      break;
    case 'Print-Peak':
      console.log("Peak is:" + pq.peak())
      break;
    case 'Is-Empty':
      pq.isEmpty()
      break;
    case 'Print-Heap':
      pq.printHeap()
      break;
    case 'Exit':
      readline.close();
      break;
    default:
      console.log('No found command!');
      break;
  }
  console.log("\n");
  readline.prompt();
});

readline.on('close', function () {
  console.log('bye bye!');
  process.exit(0);
});
