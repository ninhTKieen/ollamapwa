import { DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import {
  AlignLeft,
  ChevronDown,
  DeleteIcon,
  EllipsisVerticalIcon,
  SettingsIcon,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnapshot } from 'valtio';

import { PROJECT_NAME } from '@/configs/constants';
import { useCheckOllamaServer } from '@/hooks/use-check-ollama-server';
import { useGetLocalModels } from '@/hooks/use-get-local-models';
import { ollamaState } from '@/lib/states/ollama.state';
import { settingsState } from '@/lib/states/settings.state';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { AssistantImage } from './assistant-image';

export const Header = () => {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: isServerOk } = useCheckOllamaServer();

  const localModels = useGetLocalModels({ enabled: !!isServerOk });

  const { model } = useSnapshot(ollamaState);

  const handleDeleteChatHistory = useCallback(() => {
    ollamaState.chatHistory = [];
  }, []);

  return (
    <>
      <div className="sticky top-0 z-50 flex justify-between border-b bg-background px-2 py-1">
        <Button variant="ghost" className="mr-2 cursor-pointer md:hidden">
          <AlignLeft />
        </Button>

        {isServerOk ? (
          <div className="flex flex-1 justify-center md:justify-start">
            <DropdownMenu onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <div className="flex cursor-pointer">
                  <AssistantImage model={model} />

                  <div className="ml-2 w-32">
                    <h1 className="font-semibold">{PROJECT_NAME}</h1>

                    <p className="text-xs font-light text-muted-foreground">{model ?? 'AI'}</p>
                  </div>
                  <ChevronDown
                    className={cn(
                      'self-center transition-transform ease-linear',
                      isDropdownOpen && 'rotate-180',
                    )}
                  />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="z-50 mt-2 w-screen rounded-sm border border-muted bg-background shadow-sm md:ml-2 md:w-72">
                {localModels.data?.map((model, index) => (
                  <DropdownMenuItem
                    key={index}
                    onSelect={() => {
                      ollamaState.model = model.name;
                    }}
                  >
                    <AssistantImage model={model.name} />
                    <span className="ml-2">{model.name}</span>

                    {index === localModels.data?.length - 1 ? <DropdownMenuSeparator /> : null}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-50 mr-2 rounded-sm border border-muted bg-background shadow-sm">
            <DropdownMenuItem
              onSelect={() => {
                settingsState.open = true;
              }}
            >
              <SettingsIcon />
              {t('settings')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 hover:bg-destructive hover:text-destructive-foreground dark:text-red-400"
              onSelect={handleDeleteChatHistory}
              disabled={!isServerOk}
            >
              <DeleteIcon />
              {t('delete chat history')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
