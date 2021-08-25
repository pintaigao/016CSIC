const DoublyLinkedList = require("./doubly_linked_list.js");

class Node {
  constructor(data, next, prev) {
    this.data = data;
    this.next = next;
    this.prev = prev;
  }
}

const fs = require('fs');
fs.readFile('./palindrome.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  let array = data.trim().split(",");
  let result = [];
  
  let word = "moon".split("")
  determinePalindrome(word);
  
  for (let text of array) {
    let charArray = text.trim().toLowerCase().split("");
    if (determinePalindrome(charArray)) {
      result.push(text);
    }
  }
  
  console.log(result);
});

let determinePalindrome = (charArray) => {
  let stack1 = new DoublyLinkedList();
  let stack2 = new DoublyLinkedList();
  
  for (let i = 0; i < parseInt(charArray.length / 2); i++) {
    stack1.insert_head(charArray[i]);
    stack2.insert_head(charArray[charArray.length - 1 - i])
  }
  
  for (let i = 0; i < parseInt(charArray.length / 2); i++) {
    let char1 = stack1.getItem(i);
    let char2 = stack2.getItem(i);
    
    if (char1 !== char2) {
      return false
    }
  }
  
  return true;
}
