import type { LotteryHistory } from "../types/index";

export interface NormalizeFunction {
  (data: LotteryHistory): number[][];
}