
// deno-lint-ignore no-explicit-any
export type PatternEventCallback = (event: string, ...args: any[]) => void | Promise<void>;


export class PatternEventEmitter {

  private eventRegistrations: [RegExp, PatternEventCallback][] = [];


  constructor(private sequential = false) {

  }


  private makeRegExpFromEvent(event: string): RegExp {

    const pattern = (event
      .split('.')
      .map(part => part.replaceAll('*', '.*'))
      .join('\\.')
    );

    return new RegExp(`^${pattern}$`);

  }


  public on(event: string, callback: PatternEventCallback) {
    this.eventRegistrations.push([
      this.makeRegExpFromEvent(event),
      callback
    ]);
  }

  // deno-lint-ignore no-explicit-any
  public async emit(event: string, ...args: any[]) {
    for (const registration of this.eventRegistrations) {
      if (registration[0].test(event)) {
        if (this.sequential) {
          await registration[1](event, ...args);
        }
        else {
          registration[1](event, ...args);
        }
      }
    }
  }

}