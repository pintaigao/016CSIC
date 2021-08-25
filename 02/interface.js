const DoublyLinkedList = require("./doubly_linked_list.js");

class Node {
  constructor(data, next, prev) {
    this.data = data;
    this.next = next;
    this.prev = prev;
  }
}

class Interface {
  set(list) {
    this.list = JSON.parse(list);
    this.doubleLinkedList = new DoublyLinkedList()
    this.doubleLinkedList.append(list.slice());
    console.log("Initial List is:");
    console.log(this.list)
    console.log("============");
  }
  
  sort = () => {
    this.doubleLinkedList.append(this.list.sort().slice());
    console.log("Sort List is:");
    console.log(this.doubleLinkedList.tail.data);
    console.log("============");
  }
  
  reverse = () => {
    this.doubleLinkedList.append(this.list.reverse().slice());
    console.log("Reverse List is:");
    console.log(this.doubleLinkedList.tail.data);
    console.log("============");
  }
  
  add = (num) => {
    this.list.push(parseInt(num));
    this.doubleLinkedList.append(this.list.slice());
    console.log("New List is:");
    console.log(this.doubleLinkedList.tail.data);
    console.log("============");
  }
  
  undo = () => {
    this.doubleLinkedList.tail = this.doubleLinkedList.tail.prev;
    this.list = this.doubleLinkedList.tail.data.slice();
    console.log("Undo Perform:");
    console.log(this.doubleLinkedList.tail.data);
    console.log("=======");
  }
  
  redo = () => {
    this.doubleLinkedList.tail = this.doubleLinkedList.tail.next;
    this.list = this.doubleLinkedList.tail.data.slice();
    console.log("Redo Perform:");
    console.log(this.doubleLinkedList.tail.data);
    console.log("==========");
  }
  
  print = () => {
    this.doubleLinkedList.print_forward()
  }
}


const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
let interface = new Interface();

readline.setPrompt('What would you like to do? ');
readline.prompt();
readline.on('line', function(line) {
  let command = line.trim().split(" ")[0];
  let params = line.trim().split(" ")[1];
  switch(command) {
    case 'init':
      interface.set(params);
      break;
    case 'sort':
      interface.sort();
      break
    case 'reverse':
      interface.reverse();
      break;
    case 'add':
      interface.add(params)
      break;
    case 'undo':
      interface.undo();
      break;
    case 'redo':
      interface.redo();
      break;
    case 'Exit':
      readline.close();
      break;
    default:
      console.log('No found command!');
      break;
  }
  readline.prompt();
});

readline.on('close', function() {
  console.log('bye bye!');
  process.exit(0);
});
