import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnapshot } from 'valtio';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { settingsState } from '@/lib/states/settings.state';

import { OllamaForm } from './ollama-form';
import { PreferencesForm } from './preferences-form';

export const SettingsDialog = () => {
  const { t } = useTranslation();
  const { open } = useSnapshot(settingsState);

  const onOpenChange = useCallback((_open: boolean) => {
    settingsState.open = _open;
  }, []);

  const tabsList = useMemo(
    () => [
      {
        label: t('general'),
        value: 'general',
        component: <PreferencesForm open={open} onOpenChange={onOpenChange} />,
      },
      {
        label: 'Ollama',
        value: 'ollama',
        component: <OllamaForm open={open} onOpenChange={onOpenChange} />,
      },
    ],
    [onOpenChange, open, t],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-md rounded-md p-2">
        <DialogHeader>
          <DialogTitle>{t('settings')}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {tabsList.map((tab) => (
              <TabsTrigger className="w-full" key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabsList.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
