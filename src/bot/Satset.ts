import axios from "axios";
import { AUTH_ENDPOINT, BASE_URL, FARMING_ENDPOINT } from "../utils/constants";
import { InitData, InitOptions } from "../types/Satset";
import { AuthResponse, BearerToken, QueryID } from "../types/Auth";
import { FarmingStateResponse } from "../types/Farming";
import { ErrorResponse } from "../types/Error";
import { CustomError } from "./Error";
import { LogSystem } from "../utils/log";
import { RawAxiosRequestHeaders } from "axios";
import { getRemainingTime, getSleepTotalTime, sleep } from "../utils/helpers";

export class Satset {
  private queryId: QueryID;
  private bearerToken?: BearerToken;

  private log: LogSystem;

  // Options
  private options: InitOptions;

  constructor({
    initData,
    log,
    options,
  }: {
    initData: InitData;
    log: LogSystem;
    options: InitOptions;
  }) {
    this.queryId = initData.queryId;
    this.bearerToken = initData.bearerToken;
    this.log = log;
    this.options = options;
  }
  private _checkBeforeRequest = async (): Promise<void> => {
    if (!this.bearerToken) {
      await this.init();
    }
  };
  private _handleErrorAfterRequest = async ({
    message,
  }: {
    message: any;
  }): Promise<boolean> => {
    if (message == "Token is not valid") {
      this.bearerToken = undefined;
      return true;
    }
    return false;
  };
  private _getHeaders = (): RawAxiosRequestHeaders => {
    const headers: RawAxiosRequestHeaders = {
      Accept: "application/json",
      Referrer: BASE_URL,
      "x-REQUEST-ID": "873890c9-8612-4264-9faa-170f424ef670",
      "x-xss-protection": "0",
      "x-permitted-cross-domain-policies": "none",
      "x-frame-options": "SAMEORIGIN",
      "x-download-options": "noopen",
      "x-dns-prefetch-control": "off",
      "x-content-type-options": "nosniff",
      Webapp: "true",
    };
    if (this.bearerToken) {
      headers["Authorization"] = "Bearer " + this.bearerToken;
    }
    return headers;
  };

  public async makeRequest<T extends (...args: any[]) => Promise<any>>(
    func: T,
    ...params: Parameters<T>
  ): Promise<ReturnType<T> | null | any> {
    const retries =
      params[0] && typeof params[0] === "object" && "retries" in params[0]
        ? (params[0] as any).retries
        : 0;
    if (retries >= 5) {
      this.log.send("error", "Request failed after 5 retries");
      return null;
    }
    await this._checkBeforeRequest();
    try {
      return await func(...params);
    } catch (error) {
      this.log.send("error", "Request failed:", error.toString());

      const newParams = [
        { ...params[0], retries: retries + 1 },
        ...params.slice(1),
      ] as Parameters<T>;

      if (error instanceof CustomError) {
        return await this.makeRequest(func, ...newParams);
      } else {
        return error;
      }
    }
  }
  init = async (): Promise<boolean> => {
    if (!this.bearerToken) {
      this.log.send(`info`, `Getting token`);
      const auth = await this.makeAuth();
      if (!auth) {
        this.log.send(`warn`, `Failed getting token`);
        return false;
      }
      this.bearerToken = auth.token;
      this.log.send(`success`, `Getting token completed`);
      return true;
    }

    return true;
  };
  makeAuth = async (): Promise<any> => {
    try {
      const response = await axios.get(
        AUTH_ENDPOINT + "/telegram?" + this.queryId,
        {
          headers: this._getHeaders(),
        }
      );
      return response.data;
    } catch (err) {
      const { message, statusCode }: ErrorResponse = err.response?.data;
      if (message) this.log.send("error", message);

      return false;
    }
  };
  getFarmingState = async (): Promise<FarmingStateResponse | CustomError> => {
    try {
      const response = await axios.get(FARMING_ENDPOINT + "/state", {
        headers: this._getHeaders(),
      });
      return response.data;
    } catch (err) {
      const { message, statusCode }: ErrorResponse = err.response?.data;
      const errorHandled = await this._handleErrorAfterRequest({ message });
      if (errorHandled) return await this.getFarmingState();
      return new CustomError(message, statusCode);
    }
  };
  startFarming = async (): Promise<any | CustomError> => {
    try {
      const response = await axios.post(
        FARMING_ENDPOINT + "/farm",
        {},
        {
          headers: this._getHeaders(),
        }
      );
      return response.data;
    } catch (err) {
      const { message, statusCode }: ErrorResponse = err.response?.data;
      const errorHandled = await this._handleErrorAfterRequest({ message });
      if (errorHandled) return await this.getFarmingState();
      return new CustomError(message, statusCode);
    }
  };
  claimFarming = async (): Promise<any | CustomError> => {
    try {
      const response = await axios.post(
        FARMING_ENDPOINT + "/claim",
        {},
        {
          headers: this._getHeaders(),
        }
      );
      return response.data;
    } catch (err) {
      const { message, statusCode }: ErrorResponse = err.response?.data;
      const errorHandled = await this._handleErrorAfterRequest({ message });
      if (errorHandled) return await this.getFarmingState();
      return new CustomError(message, statusCode);
    }
  };
  public runFarming = async (): Promise<void> => {
    let runFarmingDelay = 60 * 1000 * 60; // 1 hour
    const farmingState = await this.makeRequest(this["getFarmingState"]);
    if (farmingState) {
      if (farmingState.state == "farming") {
        if (farmingState.timings?.left) {
          this.log.send(
            `info`,
            "Farming end in",
            getRemainingTime(farmingState.timings?.finish / 1000)
          );
          runFarmingDelay = farmingState.timings?.left + 60 * 1000 * 5;
        }
      } else if (farmingState.state == "farmed") {
        if (this.options.verbose) this.log.send(`success`, "Farming completed");
        if (this.options.verbose)
          this.log.send(`info`, "Claiming farming reward");
        const claimFarming = await this.makeRequest(this["claimFarming"]);

        this.log.send(`success`, "Farming reward claimed.");
        if (claimFarming) return await this.runFarming();
      } else if (farmingState.state == "idling") {
        if (this.options.verbose) this.log.send(`info`, "Start farming");
        const startFarmingResponse = await this.makeRequest(
          this["startFarming"]
        );
        if (startFarmingResponse) {
          this.log.send(`success`, "Farming started.");
          return await this.runFarming();
        }
      } else {
        this.log.send(
          "warn",
          `Unhandled Farming State`,
          `state: ${farmingState.state}`
        );
      }
    } else {
      this.log.send("error", `Failed run farming`);
    }
    this.log.send(
      "info",
      `Re-check farming in ${getRemainingTime(
        (new Date().getTime() + runFarmingDelay) / 1000
      )}`
    );
    await sleep(runFarmingDelay);
    return await this.runFarming();
  };
  run = async (): Promise<void> => {
    await Promise.all([this.runFarming()]);
  };
}
