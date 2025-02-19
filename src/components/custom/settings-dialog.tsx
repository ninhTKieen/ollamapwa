import { useTranslation } from 'react-i18next';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { PreferencesForm } from './preferences-form';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SettingsDialog = ({ open, onOpenChange }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-md rounded-md p-2">
        <DialogHeader>
          <DialogTitle>{t('settings')}</DialogTitle>
        </DialogHeader>

        <PreferencesForm open={open} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};
