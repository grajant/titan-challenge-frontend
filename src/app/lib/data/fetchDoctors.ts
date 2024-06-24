'use server';

export type SearchDoctorQueryParams = {
  firstName?: string;
  lastName?: string;
  state?: string;
  skip?: string;
}

type FailureResponse = {
  status: 'failure',
  error: Error,
}

type SuccessResponse = {
  status: 'success',
  data: SearchDoctorsApiResponse
}

export type SearchDoctorsApiResponse = {
  searchResults: SearchResultsData[];
  hasMoreToFetch: boolean;
}

type SearchResultsData = {
  _score: number,
  _source: {
    id: string;
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

export type SearchResponse = SuccessResponse | FailureResponse;

const endpoint = `${process.env.SEARCH_API_URL}/doctors`;

export async function fetchDoctors(queryParams: SearchDoctorQueryParams): Promise<SearchResponse> {
  const { state, ...params } = queryParams;
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
      status: 'success',
      data,
    };
  } catch (e) {
    console.error('Error searching doctors', e);

    return {
      status: 'failure',
      error: e as Error,
    };
  }
}
