import { MILLISECONDS_IN_HOUR, MILLISECONDS_IN_DAY } from '../constants';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export function formatDate(date) {
  const localDate = new Date(date);
  const localTime = localDate.getHours() + (localDate.getTimezoneOffset() / 60);
  localDate.setHours(localTime);
  const now = new Date();

  const gap = (now.getTime() - localDate.getTime());

  if (gap < MILLISECONDS_IN_HOUR && gap > 0) {
    const minutesAgo = Math.floor(gap / (60 * 1000));
    return `${minutesAgo} minutes ago`;
  } if (gap < MILLISECONDS_IN_DAY && gap > 0) {
    const hoursAgo = Math.floor(gap / (60 * 60 * 1000));
    return `${hoursAgo} hours ago`;
  }

  const day = localDate.getDate();
  const month = months[localDate.getMonth()];
  const year = localDate.getFullYear();
  const hours = localDate.getHours();
  const minutes = localDate.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

export function classnames(classes) {
  const resultArr = [];
  Object.keys(classes).forEach((classname) => {
    if (classes[classname]) {
      resultArr.push(classname);
    }
  });

  return resultArr.join(' ');
}

export function getUnreadMessagesCount(messages = []) {
  return messages.reduce((count, item) => {
    if (!item.isRead) {
      return count + 1;
    }
    return count;
  }, 0);
}
