var _ = require("lodash");

let relationships_map = {
  parent: 0,
  married: 1,
  offspring: 2,
  sibling: 3,
  adopted: 4,
  divorced: 5,
};

let map_relationships = {
  0: "parent",
  1: "married",
  2: "offspring",
  3: "sibling",
  4: "adopted",
  5: "divorced",
};

class Person {
  constructor(id, name, gender) {
    this.id = id;
    this.name = name;
    this.gender = gender;
    this.relationship = {};
  }
  
  updateRelation(relationId, personId) {
    if (!this.relationship.hasOwnProperty(relationId)) {
      this.relationship[relationId] = [personId];
    } else {
      this.relationship[relationId].push(personId);
    }
  }
  
  removeRelation(rel_id, personId) {
    if (this.relationship.hasOwnProperty(rel_id)) {
      if (this.relationship[rel_id].length > 1) {
        _.remove(this.relationship[rel_id], (option) => {
          return option === personId;
        });
      } else {
        delete this.relationship[rel_id];
      }
    }
  }
  
  checkRelationship(personId) {
    let relationship = "";
    for (let key of Object.keys(this.relationship)) {
      if (this.relationship[key].includes(personId)) {
        relationship = map_relationships[key];
        break;
      }
    }
    
    return relationship;
  }
  
  getCloseRelationship() {
    let relationship = [];
    if (this.relationship.hasOwnProperty(0)) {
      relationship = [...relationship, ...this.relationship[0]];
    }
    
    if (this.relationship.hasOwnProperty(2)) {
      relationship = [...relationship, ...this.relationship[2]];
    }
    
    if (this.relationship.hasOwnProperty(3)) {
      relationship = [...relationship, ...this.relationship[3]];
    }
    
    return relationship;
  }
}

class Graph {
  constructor() {
    this.persons = {};
  }
  
  getRelation(relationship) {
    let rel_id = relationships_map[relationship];
    let rel_id2;
    if (rel_id === 0) {
      rel_id2 = relationships_map["offspring"];
    } else if (rel_id === 2 || rel_id === 4) {
      rel_id2 = relationships_map["parent"];
    } else {
      rel_id2 = rel_id;
    }
    
    return {rel_id, rel_id2};
  }
  
  addPerson(id, name, gender) {
    if (!this.persons.hasOwnProperty(id)) {
      this.persons[id] = new Person(id, name, gender);
    }
  }
  
  removePerson(id) {
    let person = this.persons[id];
    for (let key of Object.keys(person.relationship)) {
      for (let rel_id of person.relationship[key]) {
        let relative = this.persons[rel_id];
        if (
          key === 0 &&
          (relative.relationship.hasOwnProperty(2) ||
            relative.relationship.hasOwnProperty(4))
        ) {
          relative.removeRelation(2, id);
          relative.removeRelation(4, id);
        } else if (key === 2 || key === 4) {
          relative.removeRelation(0, id);
        } else {
          relative.removeRelation(key, id);
        }
      }
    }
    
    delete this.persons[id];
  }
  
  addRelation(id1, id2, relationship) {
    let paringPerson1 = this.persons[id1];
    let paringPerson2 = this.persons[id2];
    
    let {rel_id, rel_id2} = this.getRelation(relationship);
    
    paringPerson1.updateRelation(rel_id2, id2);
    paringPerson2.updateRelation(rel_id, id1);
    
    if (rel_id === 2 || rel_id === 4) {
      let engageId = null;
      let childrenId = [];
      if (paringPerson2.relationship.hasOwnProperty(1)) {
        engageId = paringPerson2.relationship[1][0];
      } else if (paringPerson2.relationship.hasOwnProperty(5)) {
        engageId = paringPerson2.relationship[5][0];
      }
      
      if (paringPerson2.relationship.hasOwnProperty(2)) {
        childrenId = [...childrenId, ...paringPerson2.relationship[2]];
      }
      
      if (paringPerson2.relationship.hasOwnProperty(4)) {
        childrenId = [...childrenId, ...paringPerson2.relationship[4]];
      }
      
      if (engageId) {
        let person = this.persons[engageId];
        person.updateRelation(rel_id, id1);
        paringPerson1.updateRelation(0, engageId);
      }
      
      // Update Sibling Relationship
      for (let id of childrenId) {
        if (id !== id1) {
          let child = this.persons[id];
          child.updateRelation(3, id1);
          paringPerson1.updateRelation(3, id);
        }
      }
    }
    console.log(`${paringPerson1.name} and ${paringPerson2.name} has set up the ${relationship} relationship!`);
  }
  
  removeRelation(fromId, toId) {
    let fromPerson = this.persons[fromId];
    let toPerson = this.persons[toId];
    let relationship = fromPerson.checkRelationship(toId);
    let rel_id;
    
    if (!relationship) {
      console.log(`${fromPerson.name} and ${toPerson.name} has no relationship`);
    } else {
      rel_id = relationships_map[relationship];
      if (rel_id === 0 && (toPerson.relationship.hasOwnProperty(2) || toPerson.relationship.hasOwnProperty(4))) {
        toPerson.removeRelation(2, fromId);
        toPerson.removeRelation(4, fromId);
      } else if (rel_id === 2 || rel_id === 4) {
        toPerson.removeRelation(0, fromId);
      } else {
        toPerson.removeRelation(rel_id, fromId);
      }
      fromPerson.removeRelation(rel_id, toId);
      console.log(`${fromPerson.name} and ${toPerson.name} has removed ${relationship} relationship`);
    }
  }
}

class FamilyTree extends Graph {
  constructor() {
    super();
  }
  
  // 1. Check Relationship Validation
  checkRelationValidation(fromId, toId, relationship) {
    let message = "";
    // 1. Check if this person is existed
    if (
      !this.persons.hasOwnProperty(fromId) ||
      !this.persons.hasOwnProperty(toId)
    ) {
      if (!this.persons.hasOwnProperty(fromId)) {
        message = `${fromId} this person is not exist`;
      }
      
      if (!this.persons.hasOwnProperty(toId)) {
        message = `${toId} this person is not exist`;
      }
      return message;
    }
    
    let fromPerson = this.persons[fromId];
    let toPerson = this.persons[toId];
    
    if (relationship === "married") {
      // 2. A person can't marry himself/herself
      if (fromId === toId) {
        message = `${fromPerson.name} can't marry to ${fromPerson.gender === "M" ? 'himself' : 'herself'}!`;
        return message;
      }
      
      // 3. A person can't marry multiple person
      if (
        fromPerson.relationship.hasOwnProperty(1) ||
        toPerson.relationship.hasOwnProperty(1)
      ) {
        message = `${fromPerson.name} can't marry ${toPerson.name} because one of them is already married`;
        return message;
      }
      
      // 4. Consanguinity is forbidden
      let fromPerson_DirectRelationship = fromPerson.getCloseRelationship();
      let toPerson_DirectRelationshipFromPerson =
        toPerson.getCloseRelationship();
      if (
        fromPerson_DirectRelationship.includes(fromId) ||
        toPerson_DirectRelationshipFromPerson.includes(fromId)
      ) {
        message = "Consanguinity is forbidden!";
        return message;
      }
    }
  }
  
  // 1.Add Family Member
  add_family_member(id, name, gender, toId, relationship) {
    this.addPerson(id, name, gender);
    
    if (toId) {
      this.add_relation(id, toId, relationship);
    }
    
    console.log(`${name} has been add to the family tree`)
  }
  
  // 2.Remove Family Member
  remove_family_member(id) {
    let person = this.persons[id];
    console.log(`${person.name} has been removed from family tree`);
    this.removePerson(id);
  }
  
  // 3. Update Person's information
  edit_family_member_information(id, key, value) {
    let person = this.persons[id];
    switch (key) {
      case "name":
        person.name = value;
        break;
      case "gender":
        person.gender = value;
        break;
    }
  }
  
  // 4. Add relation between two person
  add_relation(fromId, toId, relationship) {
    let errorMessage = this.checkRelationValidation(fromId, toId, relationship);
    if (errorMessage) {
      console.log(errorMessage);
      return;
    }
    
    this.addRelation(fromId, toId, relationship);
  }
  
  // 5. Remove relationship between two person
  remove_relation(fromId, toId) {
    this.removeRelation(fromId, toId)
  }
}

// Question 1: Create a FamilyTree class that will represent a family tree for a given family. Please See Above
// Question 2: Programmatically add the family members to the graph as described by the accompanying family description file
let family = new FamilyTree();

family.add_family_member("1", "Patrick Earnshaw", "M");
family.add_family_member("2", "Hannah Earnshaw", "F", "001", "married");
family.add_family_member("3", "Catherine Earnshaw", "F", "001", "offspring");
family.add_family_member("4", "Hindley Earnshaw", "M", "001", "offspring");

// Andrew Linton's Family
family.add_family_member("5", "Andrew Linton", "M");
family.add_family_member("6", "Dolores Linton", "F", "5", "divorced");
family.add_family_member("7", "Isabella Linton", "F", "5", "offspring");
family.add_family_member("8", "Edgar Linton", "M", "5", "offspring");
family.addRelation("3", "8", "married");
family.add_family_member("9", "Heathcliff Linton", "M", "5", "adopted");

// Frances Byler and Cathy Linton's Family
family.add_family_member("10", "Frances Byler", "F", "4", "married");
family.add_family_member("11", "Hareton Earnshaw", "M", "4", "adopted");
family.add_family_member("12", "Cathy Linton", "F", "3", "offspring");
family.add_family_member("13", "Linton Heathcliff", "M", "7", "offspring");
family.add_relation("12", "11", "married");
family.add_relation("13", "9", "offspring");
family.add_relation("12", "13", "divorced");

// Question 3: Give data assertions to the FamilyTree class to enforce restrictions for basic family structure (at least 3); i.e A person can not marry themselves.
// Example 1. A person can't marry to self
family.add_relation("4", "4", "married");
// Example 2. A person can't marry multiple person
family.add_relation("1", "6", "married");
// Example 3.Consanguinity is forbidden!
family.add_relation("5", "7", "married");

// Question 4: Provide a simple CLI the enables users to add, remove, and edit family members.
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

var recursiveAsyncReadLine = function () {
  console.log("\n");
  readline.question('What would you like to do? Please Type the Following Command: \n 1. Add Person. \n 2. Delete Person. \n 3. Update Person \n 4. Setup Relation \n 5. Remove Relation \n 5. Print Family Tree \n 6. Exit \n Your Answer: ', (ans) => {
    if (ans === 'Add Person') {
      readline.question('Please Using the Following Format to add a Person: ID-Name-Gender[-Id of Whom To Setup Relation-Relation]\n Your Answer:', (ans) => {
        let info = ans.trim().split("-");
        let id = info[0];
        let name = info[1];
        let gender = info[2];
        
        if (info[3]) {
          let paringPerson = info[3];
          let relation = info[4];
          family.add_family_member(id, name, gender, paringPerson, relation);
        } else {
          family.add_family_member(id, name, gender);
        }
        
        recursiveAsyncReadLine()
      });
    } else if (ans === 'Update Person') {
      readline.question('Who would you like to update? Please enter the id of this person \n Your Answer:', (ans) => {
        let id = ans;
        readline.question('What would you like to change? Enter the following format command: \n 1.name-"New Name"; \n 2.gender-"F or M" \n Your Answer: ', (ans) => {
          let field = ans.trim().split("-")[0];
          let value = ans.trim().split("-")[1];
          family.edit_family_member_information(id, field, value);
          recursiveAsyncReadLine();
        })
      });
    } else if (ans === 'Delete Person') {
      readline.question('Who would you like to delete? Please enter the id of the person \n Your Answer: ', (ans) => {
        family.remove_family_member(ans);
        recursiveAsyncReadLine();
      });
      
    } else if (ans === 'Setup Relation') {
      readline.question('What relation and which two would you like to setup?Please using this format: id1-id2-relation \n Your Answer: ', (ans) => {
        let id1 = ans.trim().split("-")[0];
        let id2 = ans.trim().split("-")[1];
        let relation = ans.trim().split("-")[2];
        family.add_relation(id1, id2, relation);
        recursiveAsyncReadLine();
      });
      
    } else if (ans === 'Remove Relation') {
      readline.question('Which two would you like to remove relationship?Please using this format: id1-id2 \n Your Answer: ', (ans) => {
        let id1 = ans.trim().split("-")[0];
        let id2 = ans.trim().split("-")[1];
        family.remove_relation(id1, id2);
        recursiveAsyncReadLine();
      });
    } else if (ans === 'Print Family Tree') {
      console.log(JSON.stringify(family.persons, null, 4))
      recursiveAsyncReadLine();
    } else if (ans === 'Exit') {
      readline.close();
      console.log('bye bye!');
      process.exit(0);
    } else {
      console.log('No Command Found');
      recursiveAsyncReadLine();
    }
  });
};

// Execute the Function
recursiveAsyncReadLine();
readline.on('close', function () {
  console.log('bye bye!');
  process.exit(0);
});


/* Family Tree Reference

this.id_people = {
  "Patrick Earnshaw": {
    gender: "M",
    id: 1,
    relationships: [
      {name: "Hannah Earnshaw", relation: "marriage"},
      {name: "Catherine Earnshaw", relation: "offspring"},
      {name: "Hindley Earnshaw", relation: "offspring"},
    ],
  },
  "Hannah Earnshaw": {
    gender: "F",
    id: 2,
    relationships: [
      {name: "Patrick Earnshaw", relation: "marriage"},
      {name: "Catherine Earnshaw", relation: "offspring"},
      {name: "Hindley Earnshaw", relation: "offspring"},
    ],
  },
  "Catherine Earnshaw": {
    gender: "F",
    id: 3,
    relationships: [
      {name: "Patrick Earnshaw", relation: "parent"},
      {name: "Hannah Earnshaw", relation: "parent"},
      {name: "Hindley Earnshaw", relation: "siblings"},
      {name: "Edgar Linton", relation: "married"},
      {name: "Cathy Linton", relation: "offspring"},
    ],
  },
  "Hindley Earnshaw": {
    gender: "M",
    id: 4,
    relationships: [
      {name: "Patrick Earnshaw", relation: "parent"},
      {name: "Hannah Earnshaw", relation: "parent"},
      {name: "Catherine Earnshaw", relation: "siblings"},
      {name: "Frances Byler", relation: "married"},
      {name: "Hareton Earnshaw", relation: "adopted"},
    ],
  },
  "Andrew Linton": {
    gender: "M",
    id: 5,
    relationships: [
      {name: "Dolores Linton", relation: "divorced"},
      {name: "Isabella Linton", relation: "offspring"},
      {name: "Edgar Linton", relation: "offspring"},
      {name: "Heathcliff Linton", relation: "adopted"},
    ],
  },
  "Dolores Linton": {
    gender: "F",
    id: 6,
    relationships: [
      {name: "Andrew Linton", relation: "divorced"},
      {name: "Isabella Linton", relation: "offspring"},
      {name: "Edgar Linton", relation: "offspring"},
      {name: "Heathcliff Linton", relation: "adopted"},
    ],
  },
  "Isabella Linton": {
    gender: "F",
    id: 7,
    relationships: [
      {name: "Andrew Linton", relation: "parent"},
      {name: "Dolores Linton", relation: "parent"},
      {name: "Edgar Linton", relation: "siblings"},
      {name: "Heathcliff Linton", relation: "siblings"},
      {name: "Linton Heathcliff", relation: "offspring"},
    ],
  },
  "Edgar Linton": {
    gender: "M",
    id: 8,
    relationships: [
      {name: "Andrew Linton", relation: "parent"},
      {name: "Dolores Linton", relation: "parent"},
      {name: "Isabella Linton", relation: "siblings"},
      {name: "Heathcliff Linton", relation: "siblings"},
      {name: "Catherine Earnshaw", relation: "married"},
      {name: "Cathy Linton", relation: "offspring"},
    ],
  },
  "Heathcliff Linton": {
    gender: "M",
    id: 9,
    relationships: [
      {name: "Andrew Linton", relation: "parent"},
      {name: "Dolores Linton", relation: "parent"},
      {name: "Isabella Linton", relation: "siblings"},
      {name: "Edgar Linton", relation: "siblings"},
      {name: "Linton Heathcliff", relation: "offspring"},
    ],
  },
  "Frances Byler": {
    gender: "M",
    id: 10,
    relationships: [
      {name: "Hindley Earnshaw", relation: "married"},
      {name: "Hareton Earnshaw", relation: "adopted"},
    ],
  },
  "Hareton Earnshaw": {
    gender: "M",
    id: 11,
    relationships: [
      {name: "Hindley Earnshaw", relation: "parent"},
      {name: "Hindley Earnshaw", relation: "parent"},
      {name: "Cathy Linton", relation: "married"},
    ],
  },
  "Cathy Linton": {
    gender: "F",
    id: 12,
    relationships: [
      {name: "Catherine Earnshaw", relation: "parent"},
      {name: "Edgar Linton", relation: "parent"},
      {name: "Hareton Earnshaw", relation: "married"},
      {name: "Linton Heathcliff", relation: "divorced"},
    ],
  },
  "Linton Heathcliff": {
    gender: "M",
    id: 13,
    relationships: [
      {name: "Isabella Linton", relation: "parent"},
      {name: "Heathcliff Linton", relation: "parent"},
      {name: "Cathy Linton", relation: "divorced"},
    ],
  },
};
*/
