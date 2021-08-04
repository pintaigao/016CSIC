/**
 * Author: Pintaigao He
 */
/**
 * 1. Insertion_Sort
 * Time Complexity: O(n^2)
 * Complexity Classes: P
 */
let insertionSort = (arr) => {
  let key, j;
  for (let i = 1; i < arr.length; i++) {
    key = arr[i];
    j = i - 1;
    
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  console.log("After Sorting:" + array)
}

let array = [12, 11, 13, 5, 6];
insertionSort(array);

/**
 * 2. TSP
 * Time Complexity: O(n!)
 * Complexity Classes: NPH
 * Source: https://stackoverflow.com/questions/58186972/hamiltonian-path
 */
let hamiltonian = (vertexes, start) => {
  let n = vertexes.length;
  let paths = [[start]];
  while (paths.length > 0) {
    let tempPath = [];
    for (let path of paths) {
      const nextSteps = vertexes.find(({vertex}) =>
        vertex === path[path.length - 1]).peers.filter(v => !path.includes(v)
      );
      if (!nextSteps.length) continue;
      else if (path.length == n - 1) return [...path, nextSteps[0]];
      else nextSteps.forEach(step => tempPath.push([...path, step]));
    }
    paths = tempPath;
  }
}

const vertexes = [{vertex: 1, peers: [3, 8, 15]}, {
  vertex: 2,
  peers: [7, 14, 23]
}, {vertex: 3, peers: [1, 6, 13, 22]}, {
  vertex: 4,
  peers: [5, 12, 21]
}, {vertex: 5, peers: [4, 11, 20]}, {vertex: 6, peers: [3, 10, 19]}, {
  vertex: 7,
  peers: [2, 9, 18]
}, {vertex: 8, peers: [1, 17]}, {vertex: 9, peers: [7, 16]}, {
  vertex: 10,
  peers: [6, 15]
}, {vertex: 11, peers: [5, 14]}, {vertex: 12, peers: [4, 13]}, {
  vertex: 13,
  peers: [3, 12, 23]
}, {vertex: 14, peers: [2, 11, 22]}, {
  vertex: 15,
  peers: [1, 10, 21]
}, {vertex: 16, peers: [9, 20]}, {vertex: 17, peers: [8, 19]}, {
  vertex: 18,
  peers: [7]
}, {vertex: 19, peers: [6, 17]}, {vertex: 20, peers: [5, 16]}, {
  vertex: 21,
  peers: [4, 15]
}, {vertex: 22, peers: [3, 14]}, {vertex: 23, peers: [2, 13]}];

console.log('TSP Result:', hamiltonian(vertexes, 18));


/**
 * 3. Sum of 3d array
 * Time Complexity: O(n^3)
 * Complexity Classes: P
 */
let sum_3d_array = (array) => {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[0].length; j++) {
      for (let k = 0; k < array[0][0].length; k++) {
        sum += array[i][j][k];
      }
    }
  }
  console.log(sum);
}

let array3d =
  [
    [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ],
    [
      [10, 11, 12],
      [13, 14, 15],
      [16, 17, 18]
    ],
    [
      [19, 20, 21],
      [22, 23, 24],
      [25, 26, 27]
    ]
  ];

sum_3d_array(array3d);

/**
 * 4. Radix Sort
 * Time Complexity:O(l*(n+k))
 * Complexity Classes: P
 */
let counter = [];
let radixSort = (arr, length) => {
  let mod = 10;
  let dev = 1;
  for (let i = 0; i < length; i++, dev *= 10, mod *= 10) {
    for(let j = 0; j < arr.length; j++) {
      let bucket = parseInt((arr[j] % mod) / dev);
      if(counter[bucket]==null) {
        counter[bucket] = [];
      }
      counter[bucket].push(arr[j]);
    }
    let pos = 0;
    for(let j = 0; j < counter.length; j++) {
      let value = null;
      if(counter[j]!=null) {
        while ((value = counter[j].shift()) != null) {
          arr[pos++] = value;
        }
      }
    }
  }
  return arr;
}

radixSort([4, 59, 6, 90, 11, 2, 3], [4, 59, 6, 90, 11, 2, 3].length);

/**
 * 4. Radix Sort
 * Time Complexity: O(62^n) n: maximum length of the password
 * Complexity Classes: NPC
 */

let dict = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

let craker = (str, pos, length)=> {
  if (length === 0) {
    console.log(str)
  } else {
    for (let i = pos; i < dict.length; i++) {
      craker(str + dict[i], i, length - 1);
    }
  }
}

craker("",0,3);



