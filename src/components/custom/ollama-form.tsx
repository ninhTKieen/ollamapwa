import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useSnapshot } from 'valtio';
import * as zod from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ollamaState } from '@/lib/states/ollama.state';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const formSchema = zod.object({
  host: zod.string().url(),
});

export const OllamaForm = ({ open, onOpenChange }: Props) => {
  const { t } = useTranslation();
  const snap = useSnapshot(ollamaState);

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      host: snap.host,
    },
  });

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    ollamaState.host = values.host;
    toast.success(t('settings updated'), {
      style: {
        backgroundColor: 'green',
        color: 'white',
        boxShadow: 'var(--shadow)',
      },
    });
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) {
      form.reset({
        host: snap.host,
      });
    }
  }, [open, form, snap.host]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ollama</CardTitle>
        <CardDescription>{t('update your ollama settings')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form id="ollama-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="host"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ollama Server</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="md:flex md:justify-end">
        <Button
          disabled={snap.host === form.watch('host') || !form.watch('host')}
          type="submit"
          form="ollama-form"
          className="w-full md:w-fit"
        >
          {t('save')}
        </Button>
      </CardFooter>
    </Card>
  );
};
