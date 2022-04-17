import {mapValues} from 'lodash';
import {FlumenNodeType} from './node-type';
import {FlumenPort} from './port';

export class FlumenNode<T extends FlumenNodeType<any, any>> {
  public readonly type: T;

  public readonly inputs: {
    [K in keyof T['inputs']]: FlumenPort<InstanceType<T['inputs'][K]>>;
  };
  public readonly outputs: {
    [K in keyof T['outputs']]: FlumenPort<InstanceType<T['outputs'][K]>>;
  };

  public constructor(type: T) {
    this.type = type;

    this.inputs = mapValues(this.type.inputs, (value, key) => ({
      name: key,
      node: this,
      type: value,
      links: [],
    })) as FlumenNode<T>['inputs'];

    this.outputs = mapValues(this.type.outputs, (value, key) => ({
      name: key,
      node: this,
      type: value,
      links: [],
    })) as FlumenNode<T>['outputs'];
  }

  public async process() {
    await this.type.processor({
      input: this.input.bind(this),
      output: this.output.bind(this),
    });
  }

  public link<
    N extends FlumenNode<FlumenNodeType<unknown, any>>,
    OK extends keyof N['outputs'],
    IK extends keyof T['inputs']
  >(input: IK, node: N, output: OK): void {
    const inputPort = this.inputs[input];
    const outputPort = node.outputs[output];

    if (inputPort.type !== outputPort.type) {
      throw new Error(
        `Unable to connect ${outputPort.type.name} output to ${inputPort.type.name} input`
      );
    }

    inputPort.links = [];
    inputPort.links.push(outputPort);
  }

  public input<K extends keyof T['inputs']>(
    key: K,
    value?: InstanceType<T['inputs'][K]>
  ): T['inputs'][K] | undefined {
    const input = this.inputs[key];

    if (value !== undefined) {
      this.inputs[key].cache = value;
    }

    if (input.cache === undefined) {
      const link = input.links[0];

      if (link !== undefined) {
        input.cache = link.node.output(link.name);
      }
    }

    return this.inputs[key].cache;
  }

  public output<K extends keyof T['outputs']>(
    key: K,
    value?: InstanceType<T['outputs'][K]>
  ): InstanceType<T['outputs'][K]> | undefined {
    const output = this.outputs[key];

    if (value !== undefined) {
      output.cache = value;
    }

    if (output.cache === undefined) {
      output.node.process();
    }

    return output.cache;
  }
}
