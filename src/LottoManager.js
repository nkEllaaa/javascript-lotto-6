import { Console, Random } from '@woowacourse/mission-utils';
import Lotto from './Lotto';
import LottoResult from './LottoResult';
import { MONEY_CONSTANTS, LOTTO_CONSTANTS } from './constants/constants';

class LottoManager {
  #money;
  #count;
  #userLottoArray;
  #userLottoBonusNumber;
  #lottoArray;
  #result;

  constructor() {
    this.#money = 0;
    this.#count = 0;
    this.#userLottoArray = [];
    this.#userLottoBonusNumber = 0;
    this.#lottoArray = [];
    this.#result = null;
  }

  generateLottoNumber() {
    const lottoNumberArray = Random.pickUniqueNumbersInRange(LOTTO_CONSTANTS.minRange, LOTTO_CONSTANTS.maxRange, LOTTO_CONSTANTS.digits);

    return lottoNumberArray;
  }

  generateLottoTickets(money) {
    this.#money = money;
    this.#count = parseInt(money / MONEY_CONSTANTS.countUnit);
    const arr = Array(this.#count).fill(null);
    this.#lottoArray = arr.map(() => new Lotto(this.generateLottoNumber()));
  }

  printLottoTickets() {
    Console.print(`${this.#count}개를 구매했습니다.`);
    this.#lottoArray.forEach((array) => {
      Console.print(array.getLottoNumbersString());
    });
  }

  setUserLottoArray(userLottoArray) {
    this.#userLottoArray = userLottoArray;
  }

  setUserBonusNumber(userBonusNumber) {
    this.#userLottoBonusNumber = userBonusNumber;
  }

  determineLotteryResult() {
    const defaultResult = {
      match3: 0,
      match4: 0,
      match5: 0,
      match5Bonus: 0,
      match6: 0,
    };

    this.#result = this.#lottoArray.reduce((resultSum, lotto) => {
      const lotteryResult = lotto.determineResult(this.#userLottoArray, this.#userLottoBonusNumber);

      switch (lotteryResult) {
        case LottoResult.MATCH_3:
          return { ...resultSum, match3: resultSum.match3 + 1 };
        case LottoResult.MATCH_4:
          return { ...resultSum, match4: resultSum.match4 + 1 };
        case LottoResult.MATCH_5:
          return { ...resultSum, match5: resultSum.match5 + 1 };
        case LottoResult.MATCH_5_BONUS:
          return { ...resultSum, match5Bonus: resultSum.match5Bonus + 1 };
        case LottoResult.MATCH_6:
          return { ...resultSum, match6: resultSum.match6 + 1 };
        default:
          return resultSum;
      }
    }, defaultResult);
  }

  printResult() {
    const result = this.#result;

    Console.print(`3개 일치 (${LottoResult.MATCH_3.prize.toLocaleString('ko-KR')}원) - ${result.match3}개`);
    Console.print(`4개 일치 (${LottoResult.MATCH_4.prize.toLocaleString('ko-KR')}원) - ${result.match4}개`);
    Console.print(`5개 일치 (${LottoResult.MATCH_5.prize.toLocaleString('ko-KR')}원) - ${result.match5}개`);
    Console.print(
      `5개 일치, 보너스 볼 일치 (${LottoResult.MATCH_5_BONUS.prize.toLocaleString('ko-KR')}원) - ${
        result.match5Bonus
      }개`,
    );
    Console.print(`6개 일치 (${LottoResult.MATCH_6.prize.toLocaleString('ko-KR')}원) - ${result.match6}개`);
  }

  printYield() {
    const totalPrize =
      this.#result.match3 * LottoResult.MATCH_3.prize +
      this.#result.match4 * LottoResult.MATCH_4.prize +
      this.#result.match5 * LottoResult.MATCH_5.prize +
      this.#result.match5Bonus * LottoResult.MATCH_5_BONUS.prize +
      this.#result.match6 * LottoResult.MATCH_6.prize;

    const yieldRate = (totalPrize / this.#money) * 100;

    Console.print(`총 수익률은 ${yieldRate.toFixed(1)}%입니다.`);
  }
}

export default LottoManager;
