import schedule from 'node-schedule';
import { notifyAllUsers } from './schedules/notify-all-users';
const runningProcesses = new Set();

type ScheduleCallback = () => Promise<void>;

function runSchedule(name: string, func: ScheduleCallback) {
  if (runningProcesses.has(name)) {
    return false;
  }
  runningProcesses.add(name);
  return func()
    .catch(() => {
      return;
    })
    .then(() => {
      runningProcesses.delete(name);
    });
}

function initSchedule() {
  schedule.scheduleJob('0 0 * * *', () => {
    runSchedule('sincronizeIdentityKeys', notifyAllUsers);
  });
}

export default initSchedule;
