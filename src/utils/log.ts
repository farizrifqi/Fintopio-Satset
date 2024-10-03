import { currentTime } from './helpers';

const colors = require('@colors/colors/safe');

enum COLOUR {
  Danger = 'danger',
  Warning = 'warning',
  Info = 'info',
  Success = 'success'
}
export class LogSystem {
  private identifier: string;

  constructor(identifier?: string) {
    this.identifier = identifier ?? '-';
  }
  public send = (...outputs: unknown[]): void => {
    const listObj: Record<string, unknown> = {};
    const getObj = outputs.filter(
      (o): o is Record<string, unknown> => typeof o === 'object' && o !== null
    );

    for (const ob of getObj) {
      for (const [key, value] of Object.entries(ob)) {
        listObj[key] = value;
      }
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const type: any = outputs[0];
    const identifier =
      this.identifier.toLowerCase() === 'sys'
        ? colors.yellow.underline(`[${this.identifier}]`)
        : colors.blue.underline(`[${this.identifier}]`);
    if (Object.values(COLOUR).includes(type)) {
      outputs.shift();
      let realOutputs = outputs;
      switch (type) {
        case 'danger':
          realOutputs = realOutputs.map((o) => colors.red(o));
          break;
        case 'error':
          realOutputs = realOutputs.map((o) => colors.red(o));
          break;
        case 'warning':
          realOutputs = realOutputs.map((o) => colors.yellow(o));
          break;
        case 'info':
          realOutputs = realOutputs.map((o) => colors.cyan(o));
          break;
        case 'success':
          realOutputs = realOutputs.map((o) => colors.green(o));
          break;
      }
      console.log(
        colors.inverse(`[${currentTime()}]`),
        identifier,
        ...realOutputs
      );
    } else {
      console.log(colors.inverse(`[${currentTime()}]`), identifier, ...outputs);
    }
  };
}
