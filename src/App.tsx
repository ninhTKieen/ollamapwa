import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

import { Header } from '@/components/custom/header';
import '@/locales/i18n';

import { ChatInterface } from './components/custom/chat-interface';
import { SettingsDialog } from './components/custom/settings-dialog';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />

        <ChatInterface />

        <SettingsDialog />
      </div>

      <ReactQueryDevtools buttonPosition="bottom-left" />

      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
