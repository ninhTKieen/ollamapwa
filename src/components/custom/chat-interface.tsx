import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnapshot } from 'valtio';

import { TChatMessage } from '@/common/types';
import { useCheckOllamaServer } from '@/hooks/use-check-ollama-server';
import { useOllama } from '@/hooks/use-ollama';
import { ollamaState } from '@/lib/states/ollama.state';
import { settingsState } from '@/lib/states/settings.state';

import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { AssistantImage } from './assistant-image';
import { AssistantMessage } from './assistant-message';
import { ChatInput } from './chat-input';
import { UserMessage } from './user-message';

type TSendMsg = {
  messageContent: string;
  model: string;
  images?: string[];
};

export const ChatInterface = () => {
  const { data: isServerOk } = useCheckOllamaServer();

  const { chatHistory, model } = useSnapshot(ollamaState);
  const ollama = useOllama();

  const chatMessages = useMemo(() => chatHistory, [chatHistory]);

  const [curResponseMessage, setCurResponseMessage] = useState<string[]>([]);
  const [chatResponse, setChatResponse] = useState<{ abort: () => void }>();

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current && scrollAreaRef.current.children[1]) {
      scrollAreaRef.current.children[1].scrollTo({
        top: scrollAreaRef.current.children[1].scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  const sendMsgMutate = useMutation({
    mutationFn: async ({ messageContent, model, images }: TSendMsg) => {
      const userMessage: TChatMessage = {
        role: 'user',
        content: messageContent,
        model,
        timestamp: new Date(),
        images,
      };

      const newMessage = [...chatHistory, userMessage];

      ollamaState.chatHistory.push(userMessage);

      const response = await ollama.chat({
        model,
        messages: newMessage
          .filter((msg) => !msg.aborted)
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
            images: msg.images as string[],
          })),
        stream: true,
      });

      setChatResponse(response);

      for await (const part of response) {
        setCurResponseMessage((prev) => [...prev, part.message.content]);
        scrollToBottom();
      }

      return response;
    },
    onSuccess: (_, variables) => {
      const mergedMessage: TChatMessage = {
        role: 'assistant',
        content: curResponseMessage.join(''),
        timestamp: new Date(),
        model: variables.model,
        images: variables.images,
      };
      ollamaState.chatHistory.push(mergedMessage);
      setCurResponseMessage([]);
      scrollToBottom();
    },
    onError: (error, variables) => {
      if (error.name === 'AbortError') {
        const mergedMessage: TChatMessage = {
          role: 'assistant',
          content: curResponseMessage.join(''),
          timestamp: new Date(),
          model: variables.model,
          aborted: true,
          images: variables.images,
        };
        ollamaState.chatHistory.push(mergedMessage);
        setCurResponseMessage([]);
        scrollToBottom();
      }
    },
  });

  const handleSend = useCallback(
    (messageContent: string, images?: string[]) => {
      if (!model || !messageContent.trim()) {
        return;
      }
      sendMsgMutate.mutate({ messageContent, model, images });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [model],
  );

  const handleAbort = useCallback(() => {
    chatResponse?.abort();
  }, [chatResponse]);

  return (
    <div className="relative flex h-full flex-1 flex-col">
      {!isServerOk ? (
        <>
          <div className="mt-4 flex size-full flex-1 flex-col items-center justify-center">
            <p className="mb-4 font-mono text-xl font-semibold">{t('check ollama server')}</p>
            <Button
              onClick={() => {
                settingsState.open = true;
              }}
            >
              {t('open settings')}
            </Button>
          </div>
        </>
      ) : (
        <>
          {chatHistory.length === 0 ? (
            <div className="mt-4 flex size-full flex-1 flex-col items-center justify-center">
              <AssistantImage model={model} className="size-24" />
              <p className="mb-4 font-mono text-xl font-semibold">{model}</p>
            </div>
          ) : (
            <div className="mb-6 flex h-full flex-col">
              <div className="grow overflow-y-auto pb-[100px]">
                <ScrollArea ref={scrollAreaRef} className="flex size-full">
                  {chatMessages.map((message, index) =>
                    message.role === 'assistant' ? (
                      <AssistantMessage key={index.toString()} message={message} className="p-3" />
                    ) : (
                      <UserMessage key={index.toString()} message={message} className="p-3" />
                    ),
                  )}
                  {curResponseMessage.length > 0 && (
                    <AssistantMessage
                      message={{
                        role: 'assistant',
                        content: curResponseMessage.join(''),
                        timestamp: new Date(),
                        model,
                      }}
                      className="p-3"
                    />
                  )}
                </ScrollArea>
              </div>
            </div>
          )}
          <div className="fixed inset-x-0 bottom-0 mt-4 bg-background">
            <ChatInput
              onSend={handleSend}
              onAbort={handleAbort}
              isGenerating={sendMsgMutate.isPending}
            />
          </div>
        </>
      )}
    </div>
  );
};
