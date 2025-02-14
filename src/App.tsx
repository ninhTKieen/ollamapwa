import { useTranslation } from 'react-i18next';

import { Header } from '@/components/custom/header';
import { Textarea } from '@/components/ui/textarea';

function App() {
  const { t } = useTranslation();

  return (
    <div className="bg-background">
      <Header />
      <div className="mt-6" />
      <Textarea placeholder={t('ask something')} />
    </div>
  );
}

export default App;
