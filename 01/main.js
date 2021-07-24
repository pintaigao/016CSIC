const fs = require('fs');
const csv = require('csv-parser');

class NumberDealer {
  constructor(numberList) {
    this.numberLiset = numberList;
    this.maxNumber = Number.MIN_SAFE_INTEGER;
    this.minNumber = Number.MAX_SAFE_INTEGER;
    this.data = [];
  }
  
  findMaxNumber(index) {
    if (index < this.data.length) {
      if (this.data[index] > this.maxNumber) {
        this.maxNumber = this.data[index];
      }
    }
    
    if (index === this.data.length) {
      console.log(this.maxNumber);
      return this.maxNumber;
    }
    
    this.findMaxNumber(index + 1);
  }
  
  findMinNumber() {
    for (let i = 0; i < this.data.length; i++) {
      if(this.data[i] < this.minNumber) {
        this.minNumber = this.data[i];
      }
    }
  
    console.log(this.minNumber);
    return this.minNumber;
  }
  
  execute() {
    let filePath = process.argv[2];
    
    let csv = require('fast-csv');
    
    var stream = fs.createReadStream(filePath);
    
    csv.parseStream(stream)
      .on("data", (data) => {
        this.data = data;
        console.log(data)
      })
      .on("end", () => {
        // 1. Execute find max method
        this.findMaxNumber(0);
        this.findMinNumber();
      });
  }
}

let instance = new NumberDealer([1, 2, 3]);
instance.execute();
