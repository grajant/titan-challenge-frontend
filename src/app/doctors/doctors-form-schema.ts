import { z } from 'zod';

const firstName = z.string().regex(/[a-zA-Z]+/, 'Please enter a valid name. Only letters are allowed');
const lastName = z.string().regex(/[a-zA-Z]+/, 'Please enter a valid last name. Only letters are allowed');

export const doctorsFormSchema = z.discriminatedUnion('withState', [
  z.object({
    withState: z.literal(false),
    firstName,
    lastName,
    state: z.undefined(),
  }),
  z.object({
    withState: z.literal(true),
    firstName,
    lastName,
    state: z.string({
      required_error: 'Please select one state',
    }),
  })
]);

export type DoctorsForm = z.infer<typeof doctorsFormSchema>;
