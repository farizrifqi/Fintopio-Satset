import moment from 'moment';
export const getRandomInt = (min: number, max: number): number => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const currentTime = (): string => {
  let date_ob = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
  );
  let hours = zeroPad(date_ob.getHours().toString());
  let minutes = zeroPad(date_ob.getMinutes().toString());
  let seconds = zeroPad(date_ob.getSeconds().toString());
  let milsec = zeroPad(date_ob.getMilliseconds().toString(), true);
  return hours + ':' + minutes + ':' + seconds + ':' + milsec;
};
export const zeroPad = (str: any, s = false): string => {
  str = str.toString();
  if (s) {
    str = str.length > 2 ? str.substring(0, 2) : str;
  }
  return str.length >= 2 ? str : '0' + str;
};

export const getSleepTotalTime = (t: any): string => {
  const currentTime = moment(t);

  const hours = Number(currentTime.format('HH'));
  const minutes = Number(currentTime.format('mm'));
  const seconds = Number(currentTime.format('ss'));
  let strResult = '';
  if (hours) {
    strResult = `${hours} hours`;
  }
  if (minutes) {
    strResult = `${strResult} ${minutes} minutes`;
  }
  if (seconds) {
    strResult = `${strResult} ${seconds} seconds`;
  }
  return `${strResult}`;
};

export const getRemainingTime = (endAt: number): string => {
  let resultText: string[] = [];
  const now = moment().unix();
  const remainingTime = endAt - now;
  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = Math.floor((remainingTime % 3600) % 60);
  if (hours) {
    resultText.push(`${hours} hours`);
  }
  if (minutes) {
    resultText.push(`${minutes} minutes`);
  }
  if (seconds) {
    resultText.push(`${seconds} seconds`);
  }
  return resultText.join(' ');
};
