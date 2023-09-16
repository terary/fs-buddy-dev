class xInvalidEvaluation {
  private _message: string;
  private _payload: any;
  constructor(message: string, payload?: any) {
    this._message = message;
    this._payload = payload;
  }

  get message() {
    return this._message;
  }

  get payload() {
    return this._payload;
  }
}
export { xInvalidEvaluation };
