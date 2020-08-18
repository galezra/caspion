import { ProgressEmitter, ScrapingEventEmitter, ScrapingEvents } from '../commonTypes';

export default class EmptyEventEmitterAdapter implements ScrapingEventEmitter {
  optional?: ScrapingEventEmitter;

  constructor(eventEmitter?: ScrapingEventEmitter) {
    this.optional = eventEmitter;
  }

  on<U extends 'status' | 'progress' | 'error' | 'finish'>(event: U, listener: ScrapingEvents[U]): this {
    this.optional?.on(event, listener);
    return this;
  }

  emit<U extends 'status' | 'progress' | 'error' | 'finish'>(event: U, ...args: Parameters<ScrapingEvents[U]>): boolean {
    const res = this.optional?.emit(event, ...args);
    return res === undefined || res === true;
  }

  listenTo(emitter: ProgressEmitter): void {
    emitter.onProgress((...args: any[]) => this.emit('progress', args));
  }
}
