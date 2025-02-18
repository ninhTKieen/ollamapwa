import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useSnapshot } from 'valtio';

import { TChatMessage } from '@/common/types';
import { useOllama } from '@/hooks/use-ollama';
import { ollamaState } from '@/lib/states/ollama.state';

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
  const { chatHistory, model } = useSnapshot(ollamaState);
  const ollama = useOllama();

  const chatMessages = useMemo(() => chatHistory, [chatHistory]);

  const [curResponseMessage, setCurResponseMessage] = useState<string[]>([]);
  const [chatResponse, setChatResponse] = useState<{ abort: () => void }>();

  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
    <div className="relative flex flex-1 flex-col">
      {chatHistory.length === 0 ? (
        <div className="mt-4 flex size-full flex-1 flex-col items-center justify-center">
          <AssistantImage model={model} className="size-24" />
          <p className="mb-4 font-mono text-xl font-semibold">{model}</p>
        </div>
      ) : (
        <div className="grow overflow-y-hidden">
          <ScrollArea className="flex size-full">
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
      )}

      <ChatInput onSend={handleSend} onAbort={handleAbort} isGenerating={sendMsgMutate.isPending} />
    </div>
  );
};
