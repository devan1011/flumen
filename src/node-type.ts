export class FlumenNodeType<I, O> {
  public readonly name: string;

  public readonly inputs: {[K in keyof I]: new () => I[K]};
  public readonly outputs: {[K in keyof O]: new () => O[K]};

  public readonly processor: (options: {
    input: <K extends keyof I>(key: K) => I[K];
    output: <K extends keyof O>(key: K, value: O[K]) => void;
  }) => void;

  public constructor(
    name: string,
    inputs: FlumenNodeType<I, O>['inputs'],
    outputs: FlumenNodeType<I, O>['outputs'],
    processor: FlumenNodeType<I, O>['processor']
  ) {
    this.name = name;
    this.inputs = inputs;
    this.outputs = outputs;
    this.processor = processor;
  }
}
