import {FlumenNode} from './node';
import {FlumenNodeType} from './node-type';

const numberInputType = new FlumenNodeType(
  'input',
  {},
  {
    value: Number,
  },
  ({output}) => {
    output('value', 3);
  }
);

const stringInputType = new FlumenNodeType(
  'input',
  {},
  {
    value: String,
  },
  async ({output}) => {
    output('value', '3');
  }
);

const outputType = new FlumenNodeType(
  'output',
  {
    value: String,
  },
  {},
  async ({input}) => {
    console.log('Output:', input('value'));
  }
);

const addType = new FlumenNodeType(
  'add',
  {
    a: Number,
    b: Number,
  },
  {
    sum: Number,
  },
  ({input, output}) => {
    output('sum', (input('a') as number) + (input('b') as number));
  }
);

const outputNode = new FlumenNode(outputType);
const addNode = new FlumenNode(addType);
const inputA = new FlumenNode(numberInputType);
const inputB = new FlumenNode(numberInputType);

outputNode.link('value', addNode, 'sum');
addNode.link('a', inputA, 'value');
addNode.link('b', inputB, 'value');

console.log('Output:', outputNode.input('value'));
