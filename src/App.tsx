import { useTranslation } from 'react-i18next';

import { Textarea } from '@/components/ui/textarea';

function App() {
  const { t } = useTranslation();

  return (
    <div className="bg-background">
      <Textarea placeholder={t('ask something')} />
    </div>
  );
}

export default App;
