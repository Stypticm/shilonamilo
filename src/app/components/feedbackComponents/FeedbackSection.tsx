'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addRating } from '@/app/chats/functions';
import { useToast } from '@/lib/hooks/useToast';

interface IFeedbackSectionProps {
  closeFeedback: () => void;
  lotId: string;
  userId: string;
  role: 'owner' | 'participant';
}

const FeedbackSection: React.FC<IFeedbackSectionProps> = ({
  closeFeedback,
  lotId,
  userId,
  role,
}) => {
  const { toast } = useToast();

  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');

  const FormSchema = z.object({
    comment: z
      .string()
      .min(1, { message: 'Comment is required' })
      .max(100, { message: 'Comment must be less than 100 characters' }),
    rating: z
      .number()
      .min(1, { message: 'Rating is required' })
      .max(5, { message: 'Rating must be less than 5' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const feedBackForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sendFeedback = await addRating(role, lotId, userId, rating, comment);

    if (sendFeedback?.error) {
      toast({
        title: 'Error',
        description: sendFeedback.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: sendFeedback.message,
        className: 'bg-green-600',
      });
      closeFeedback();
      setComment('');
      setRating(0);
    }
  };

  return (
    <section className="flex flex-col shadow-2xl rounded-lg cursor-pointer">
      <span className="text-xl font-serif text-center font-bold">
        {role === 'owner' ? 'Owner Rating' : 'Participant Rating'}
      </span>
      <Form {...form}>
        <form onSubmit={feedBackForm} className="flex flex-col gap-2 w-full p-2">
          <section className="flex flex-col gap-2 w-full p-2">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="flex items-center justify-center gap-2">
                  <FormLabel>Rating: </FormLabel>
                  <Input
                    className="w-2/6"
                    type="number"
                    step={1}
                    min={1}
                    max={5}
                    {...field}
                    onChange={(e) => setRating(Number(e.target.value))}
                  />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment: </FormLabel>
                  <Textarea {...field} onChange={(e) => setComment(e.target.value)} />
                </FormItem>
              )}
            ></FormField>
          </section>
          <Button type="submit" variant="outline" size="lg" className="bg-[#b5ad0e]">
            Send feedback
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default FeedbackSection;
