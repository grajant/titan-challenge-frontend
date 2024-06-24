'use server';

import { DoctorsForm, doctorsFormSchema } from '@/app/doctors/doctors-form-schema';
import { redirect } from 'next/navigation';

type State = {
  errors?: {
    [key in keyof DoctorsForm]?: string[];
  };
  message?: string | null;
};
type MyFormData<T> = {
  get: (key: keyof T) => FormDataEntryValue | null;
} & Omit<FormData, 'get'>;

export async function searchDoctors(
  _prevState: State,
  formData: MyFormData<DoctorsForm>
) {
  const parsedData = doctorsFormSchema.safeParse({
    firstName: formData.get('firstName') || '',
    lastName: formData.get('lastName') || '',
    state: formData.get('state') || undefined,
    withState: Boolean(formData.get('withState')),
  });

  console.debug('State', formData.get('state'), 'withState', Boolean(formData.get('withState')));

  if (!parsedData.success) {
    console.debug('Form errors', parsedData.error.flatten().fieldErrors);

    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: 'Please check the data you provided',
    };
  }

  const { withState, state, ...params } = parsedData.data;
  const searchParams = new URLSearchParams({
    ...(state ? { state } : {}),
    ...params,
  }).toString();

  redirect(`/doctors/search?${searchParams}`);
}
