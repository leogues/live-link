import { cn } from '../utils/cn';

type FormHeaderProps = {
  title: string;
  fontWeight?: 'medium' | 'semibold';
};

export const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  fontWeight = 'md',
}) => {
  return (
    <header className="flex justify-center border-b border-gray-300 pb-3">
      <h3
        className={cn('text-2xl font-medium', {
          'font-medium': fontWeight === 'md',
          'font-semibold': fontWeight === 'semibold',
        })}
      >
        {title}
      </h3>
    </header>
  );
};
