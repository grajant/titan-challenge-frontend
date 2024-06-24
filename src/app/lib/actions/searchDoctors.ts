'use server';

import { DoctorsForm, doctorsFormSchema } from '@/app/doctors/doctors-form-schema';

export type SearchDoctorsApiResponse = {
  searchResults: SearchResultsData[];
}

type SearchResultsData = {
  _source: {
    fullName: string;
    specialty: string;
    address: {
      street: string;
      city: string;
      state: string;
    };
    telephoneNumber: string;
  }
}

type State = {
  errors?: {
    [key in keyof DoctorsForm]?: string[];
  };
  message?: string | null;
  data?: SearchDoctorsApiResponse;
};
type MyFormData<T> = {
  get: (key: keyof T) => FormDataEntryValue | null;
} & Omit<FormData, 'get'>;

export async function searchDoctors(
  _prevState: State,
  formData: MyFormData<DoctorsForm>
) {
  const endpoint = `${process.env.SEARCH_API_URL}/doctors`;
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
    state: state || '',
    ...params,
  }).toString();

  try {
    const response = await fetch(`${endpoint}?${searchParams}`);

    if (!response.ok) throw new Error();

    const data = await response.json() as SearchDoctorsApiResponse;
    console.debug('Retrieved doctors', data);

    return {
      data,
    };
  } catch (e) {
    console.error('Error searching doctors', e);

    return {
      errors: undefined,
      message: 'Unexpected error',
    };
  }
}
