import _dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';

_dayjs.locale('vi');
_dayjs.extend(relativeTime);

export const dayjs = _dayjs;
