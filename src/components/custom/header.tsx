import { DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { AlignLeft, DeleteIcon, EllipsisVerticalIcon, SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PROJECT_NAME } from '@/configs/constants';

import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { AssistantImage } from './assistant-image';
import { SettingsDialog } from './settings-dialog';

export const Header = () => {
  const { t } = useTranslation();
  const [onOpenSetting, setOnOpenSetting] = useState(false);

  return (
    <>
      <div className="flex justify-between border-b px-2 py-1">
        <Button variant="ghost" className="mr-2 cursor-pointer md:hidden">
          <AlignLeft />
        </Button>

        <div className="flex flex-1">
          <AssistantImage model="deepseek" />

          <div className="ml-2">
            <h1 className="font-semibold">{PROJECT_NAME}</h1>

            <p className="text-xs font-light text-muted-foreground">deepseek</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-50 mr-2 rounded-sm border border-muted bg-background">
            <DropdownMenuItem onSelect={() => setOnOpenSetting(true)}>
              <SettingsIcon />
              {t('settings')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 hover:bg-destructive hover:text-destructive-foreground dark:text-red-400">
              <DeleteIcon />
              {t('delete chat history')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SettingsDialog open={onOpenSetting} onOpenChange={setOnOpenSetting} />
    </>
  );
};
