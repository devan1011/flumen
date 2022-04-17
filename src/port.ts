import {FlumenNode} from './node';

export interface FlumenPort<T> {
  name: string;
  node: FlumenNode<any>;
  type: new () => T;
  links: FlumenPort<T>[];
  cache?: T;
}
