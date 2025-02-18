import { ArrowUpIcon, PaperclipIcon, SquareIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (content: string, images?: string[]) => void;
  onAbort?: () => void;
  isGenerating?: boolean;
}

export function ChatInput({ onSend, onAbort, isGenerating }: ChatInputProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isFocusing, setIsFocusing] = useState(false);

  const handleSend = useCallback(() => {
    if (!input.trim() && selectedImages.length === 0) return;
    const imagesAsBase64 = selectedImages.map((image) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });
    });

    Promise.all(imagesAsBase64).then((imagesBase64) => {
      onSend(input, imagesBase64.length > 0 ? imagesBase64 : undefined);
      setInput('');
    });
    setSelectedImages([]);
  }, [input, selectedImages, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = '';
    element.style.height = `${Math.min(element.scrollHeight, 300)}px`;
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight(e.target);
  };

  return (
    <div className="z-10 bg-background px-3 pb-3">
      <div
        className={cn(
          'flex flex-col rounded-xl border',
          isFocusing && 'ring ring-gray-400 dark:ring-gray-700',
        )}
      >
        <textarea
          className="min-h-[42px] w-full resize-none bg-transparent p-3 pb-1.5 text-sm outline-none"
          value={input}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocusing(true)}
          onBlur={() => setIsFocusing(false)}
          placeholder={t('ask something')}
        />

        <div className="flex items-center justify-between gap-2 px-3 pb-2">
          <div className="flex items-center gap-2">
            <label
              htmlFor="file-input"
              className={buttonVariants({
                variant: 'ghost',
                size: 'icon',
                className: 'size-8 cursor-pointer',
              })}
            >
              <PaperclipIcon className="size-5 text-gray-500" />
            </label>
            <input
              type="file"
              id="file-input"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 0) {
                  setSelectedImages((prev) => [...prev, ...files]);
                }
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            {selectedImages.length > 0 && (
              <div className="flex max-w-[100px] items-center gap-1 truncate text-xs text-gray-500">
                <span>
                  {selectedImages.length} image{selectedImages.length > 1 ? 's' : ''}
                </span>
                <button
                  className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => setSelectedImages([])}
                >
                  ×
                </button>
              </div>
            )}
            {isGenerating ? (
              <Button
                size="icon"
                className={buttonVariants({
                  variant: 'ghost',
                  className: 'size-8 animate-pulse cursor-pointer',
                })}
                onClick={onAbort}
              >
                <SquareIcon className="size-4 text-current" />
              </Button>
            ) : (
              <Button
                size="icon"
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'icon',
                  className:
                    'size-8 cursor-pointer transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:ring disabled:ring-gray-300 dark:disabled:bg-gray-900 dark:disabled:text-gray-500 dark:disabled:ring dark:disabled:ring-gray-500',
                })}
                disabled={!input.trim() && selectedImages.length === 0}
                onClick={handleSend}
              >
                <ArrowUpIcon className="size-6 text-current" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
