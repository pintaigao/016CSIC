/**
 * README:
 * 1. Open terminal, and cd path to folder, run npm install
 * 2. run "node main.js random_numbers.csv" in terminal¥
 * 3. Result will be shown
 **/

class NumberDealer {
  constructor(data) {
    this.data = data;
    this.upperBound = Number.MIN_SAFE_INTEGER;
    this.lowBound = Number.MAX_SAFE_INTEGER;
  }
  
  findUpperBound(index) {
    if (index < this.data.length) {
      if (this.data[index] > this.upperBound) {
        this.upperBound = this.data[index];
      }
    }
    
    if (index === this.data.length) {
      console.log("The Maximum Number is:");
      console.log(this.upperBound);
      return this.upperBound;
    }
    
    this.findUpperBound(index + 1);
  }
  
  findLowerBound() {
    for (let i = 0; i < this.data.length; i++) {
      if(this.data[i] < this.lowBound) {
        this.lowBound = this.data[i];
      }
    }
    console.log("The Lower Bound is:");
    console.log(this.lowBound);
    return this.lowBound;
  }
  
  main() {
    let fs = require('fs');
    let csv = require('fast-csv');
    
    let filePath = process.argv[2];
    
    if(filePath) {
      let stream = fs.createReadStream(filePath);
      csv.parseStream(stream)
        .on("data", (data) => {
          this.data = data;
        })
        .on("end", () => {
          // find max number
          this.findUpperBound(0);
          // find min number
          this.findLowerBound();
        });
    } else {
      // find max number
      this.findUpperBound(0);
      // find min number
      this.findLowerBound();
    }
  }
}

let instance = new NumberDealer([1,2,3]);
instance.main();
