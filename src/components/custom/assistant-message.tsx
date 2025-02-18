import 'katex/dist/katex.min.css';
import { CopyIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { toast } from 'sonner';

import { TChatMessage } from '@/common/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { dayjs } from '@/lib/date.util';
import { cn } from '@/lib/utils';

import { AssistantImage } from './assistant-image';

interface AssistantMessageProps {
  className?: string;
  message: TChatMessage;
}

const MarkdownContent = ({ content }: { content: string }) => {
  const { t } = useTranslation();

  return (
    <ReactMarkdown
      className="text-sm"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ className, children, ...rest }) {
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <div className="overflow-x-scroll rounded-xl bg-zinc-600">
              <div className="flex items-center justify-between py-1 pl-2 pr-1">
                <div className="font-mono text-xs text-white">{match[1]}</div>
                <Button
                  size="icon"
                  variant="ghost"
                  className={buttonVariants({
                    variant: 'ghost',
                    className:
                      'size-8 cursor-pointer text-white transition-all hover:bg-zinc-500 hover:text-white',
                  })}
                  onClick={async () => {
                    await navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                    toast.success(t('copied to clipboard'));
                  }}
                >
                  <CopyIcon />
                </Button>
              </div>
              <SyntaxHighlighter
                {...(rest as any)}
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
                wrapLines={true}
                wrapLongLines={true}
                lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code
              {...rest}
              className={cn('overflow-x-auto rounded bg-muted px-1 py-0.5 text-sm', className)}
            >
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="mb-4 whitespace-pre-wrap last:mb-0">{children}</p>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

const renderContent = (message: TChatMessage) => {
  if (message.model?.includes('deepseek-r1')) {
    const thinkMatch = message.content.match(/<think>(.*?)(<\/think>|$)/s);
    const thinkContent = thinkMatch ? thinkMatch[1] : '';
    const mainContent = message.content.replace(/<think>.*?(<\/think>|$)/s, '').trim();
    return (
      <>
        {thinkContent && (
          <div className="mb-2 rounded-xl bg-muted p-2">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              {mainContent ? 'Think result' : 'Thinking...'}
            </p>
            <MarkdownContent content={thinkContent} />
          </div>
        )}
        <MarkdownContent content={mainContent} />
      </>
    );
  }

  return <MarkdownContent content={message.content} />;
};

export const AssistantMessage = ({ message, className }: AssistantMessageProps) => {
  const { i18n } = useTranslation();

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-2">
        <AssistantImage
          className="size-6 rounded-lg bg-white p-0.5 ring ring-border"
          model={message.model}
        />
        <div className="font-mono text-xs font-bold">{message.model}</div>
      </div>
      <div className="flex flex-col gap-1">
        {renderContent(message)}
        <div className="text-xs text-muted-foreground">
          {dayjs(message.timestamp).locale(i18n.language).fromNow()}
        </div>
      </div>
    </div>
  );
};
