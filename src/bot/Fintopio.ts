import { InitData, InitOptions } from '../types/Satset';
import { Satset } from './Satset';
import { parseQuery } from '../utils/parser';
import { BotIdentifier } from '../types/Auth';
import { LogSystem } from '../utils/log';

interface FintopioBot {
  client: Satset;
  data?: BotIdentifier;
}
export class Fintopio {
  public bots: FintopioBot[] = [];
  private listInitiatedData: InitData[];
  private options: InitOptions;
  private log = new LogSystem('SYS');
  private initiated = true;

  constructor(data: InitData[], options?: InitOptions) {
    this.listInitiatedData = data;
    const defaultOptions: InitOptions = {
      verbose: false,
      farming: true
    };
    this.options = { ...defaultOptions, ...options };
  }

  private initBot = async (initData: InitData): Promise<void> => {
    const parsedQuery = parseQuery(initData.queryId);
    const log = new LogSystem(parsedQuery?.user.username || '-');
    const bot = new Satset({ initData, log, options: this.options });
    // const initiated = await bot.makeRequest(bot["init"]);
    const initiated = await bot.init();

    if (!initiated) return;
    this.bots.push({
      client: bot,
      data: {
        username: parsedQuery?.user.username ?? undefined,
        telegramId: parsedQuery?.user.id?.toString() ?? undefined
      }
    });
  };

  public init = async (): Promise<void> => {
    this.log.send(
      `info`,
      `Start initiating ${this.listInitiatedData.length} queryId`
    );
    await Promise.all(this.listInitiatedData.map((data) => this.initBot(data)));
    this.initiated = true;

    this.log.send(
      this.bots.length > 0 ? `success` : `error`,
      `${this.bots.length} of ${this.listInitiatedData.length} query successfully initiated.`
    );
  };
  public run = async (): Promise<void> => {
    if (!this.initiated) {
      this.log.send(`error`, `Please initiate the bot first.`);
      return;
    }
    this.log.send(`info`, 'Running...');
    await Promise.all(this.bots.map((bot) => bot.client.run()));
  };
}
