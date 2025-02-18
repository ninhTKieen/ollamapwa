import { useTranslation } from 'react-i18next';

import { TChatMessage } from '@/common/types';
import { dayjs } from '@/lib/date.util';
import { cn } from '@/lib/utils';

type TUserMessageProps = {
  message: TChatMessage;
  className?: string;
};

export const UserMessage = ({ message, className }: TUserMessageProps) => {
  const { i18n } = useTranslation();

  return (
    <div className={cn('flex justify-end', className)}>
      <div className="max-w-[80%] flex-col space-y-1">
        <div className="rounded-2xl rounded-br-sm bg-muted px-3 py-2">
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        </div>
        <div className="justify-self-end text-xs text-muted-foreground">
          {dayjs(message.timestamp).locale(i18n.language).fromNow()}
        </div>
      </div>
    </div>
  );
};
