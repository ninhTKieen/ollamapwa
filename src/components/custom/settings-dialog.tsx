import { zodResolver } from '@hookform/resolvers/zod';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useSnapshot } from 'valtio';
import * as zod from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { preferencesState } from '@/lib/states/preferences.state';
import i18n from '@/locales/i18n';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const formSchema = zod.object({
  theme: zod.enum(['light', 'dark', 'system']).default('system'),
  lang: zod.enum(['en', 'vi']).default('en'),
});

export const SettingsDialog = ({ open, onOpenChange }: Props) => {
  const { t } = useTranslation();
  const snap = useSnapshot(preferencesState);

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lang: snap.lang,
      theme: snap.theme,
    },
  });

  const themeOptions = useMemo(
    () => [
      { label: t('system'), value: 'system', icon: MonitorIcon },
      { label: t('dark'), value: 'dark', icon: MoonIcon },
      { label: t('light'), value: 'light', icon: SunIcon },
    ],
    [t],
  );

  const langOptions = useMemo(
    () => [
      { label: `${t('english')} 🏴󠁧󠁢󠁥󠁮󠁧󠁿`, value: 'en' },
      { label: `${t('vietnamese')} 🇻🇳`, value: 'vi' },
    ],
    [t],
  );

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    preferencesState.theme = values.theme;
    preferencesState.lang = values.lang;
    await i18n.changeLanguage(values.lang);
    toast.success(t('settings updated'));
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) {
      form.reset({
        lang: snap.lang,
        theme: snap.theme,
      });
    }
  }, [open, form, snap.lang, snap.theme]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-md p-2 md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('settings')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('appearance')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select a theme')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {themeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="size-4" />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {langOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">{t('save')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
