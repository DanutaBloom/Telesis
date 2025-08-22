import type * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { Controller, FormProvider } from 'react-hook-form';

import { Label } from '@/components/ui/label';
import { cn } from '@/utils/Helpers';

import { FormFieldContext, FormItemContext, useFormField } from './useFormField';

const Form = FormProvider;

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const formFieldName = React.useMemo(() => ({ name: props.name }), []);

  return (
    <FormFieldContext.Provider value={formFieldName}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const formItemId = React.useMemo(() => ({ id }), []);

  return (
    <FormItemContext.Provider value={formItemId}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(
        error && 'text-destructive',
        'transition-colors duration-200',
        className
      )}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId }
    = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-sage-stone', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    variant?: 'error' | 'success' | 'info';
  }
>(({ className, children, variant, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  const messageVariant = variant || (error ? 'error' : 'info');
  const variantStyles = {
    error: 'text-destructive',
    success: 'text-sage-growth',
    info: 'text-sage-stone',
  };

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn(
        'text-sm font-medium transition-colors duration-200',
        variantStyles[messageVariant],
        className
      )}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

// Enhanced form components with Modern Sage theming
const FormSuccess = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formMessageId } = useFormField();

  return (
    <p
      ref={ref}
      id={`${formMessageId}-success`}
      className={cn(
        'text-sm font-medium text-sage-growth flex items-center gap-2',
        className
      )}
      {...props}
    />
  );
});
FormSuccess.displayName = 'FormSuccess';

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSuccess,
};
