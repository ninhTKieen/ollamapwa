import { AvatarProps } from '@radix-ui/react-avatar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AssistantAvatarProps extends AvatarProps {
  model?: string | null;
}

function getModelImagePath(model?: string | null) {
  if (!model) return 'ollama';
  if (model.includes('deepseek')) return 'deepseek';
  if (model.includes('gemma')) return 'gemma';
  if (model.includes('llava')) return 'llava';
  if (model.includes('llama')) return 'meta';
  if (model.includes('phi')) return 'microsoft';
  if (model.includes('mistral')) return 'mistral';
  if (model.includes('qwen')) return 'qwen';

  return 'ollama';
}

export const AssistantImage = ({ model, ...props }: AssistantAvatarProps) => {
  const modelImagePath = getModelImagePath(model);

  return (
    <Avatar {...props}>
      <AvatarImage
        className="object-contain"
        src={`/model-images/${modelImagePath}.png`}
        alt="model-image"
      />
      <AvatarFallback>{'AI'}</AvatarFallback>
    </Avatar>
  );
};
