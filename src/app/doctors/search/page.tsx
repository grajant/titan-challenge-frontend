import { redirect } from 'next/navigation';
import { DoctorsTable } from '@/app/doctors/doctors-table';
import { fetchDoctors, SearchDoctorQueryParams } from '@/app/lib/data/fetchDoctors';
import { Button } from '@mui/material';
import { ArrowBack, SearchOff } from '@mui/icons-material';
import Link from 'next/link';
import { FC } from 'react';


type PageProps = {
  searchParams: SearchDoctorQueryParams;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { firstName, lastName, state } = searchParams;

  if (!firstName || !lastName) redirect('/doctors');

  const response = await fetchDoctors(searchParams);
  if (response.status === 'failure') return <div>An error has occurred</div>;

  const { data } = response;

  return (
    <div className="flex flex-col gap-y-8">
      <Link href="/doctors" className="w-max">
        <Button variant="outlined" className="flex gap-x-2">
          <ArrowBack/>
          New search
        </Button>
      </Link>
      {data.searchResults.length ? <DoctorsTable data={data} searchedName={`${firstName} ${lastName}`}/> : <EmptyResult
        searchedName={`${firstName} ${lastName}`} state={state}/>}
    </div>
  );
}

const EmptyResult: FC<{ searchedName: string, state?: string }> = ({ searchedName, state }) => {
  return (
    <div className="flex flex-col gap-y-6 max-w-[600px] mx-auto">
      <SearchOff color="info" className="self-center text-8xl"/>
      <h1 className="text-3xl">Your search did not throw any results.</h1>
      <div className="text-left">
        <p className="text-xl">Your search details:</p>
        <p><b>Doctor&apos;s name:</b> {searchedName}</p>
        {state && <p><b>State:</b> {state}</p>}
      </div>
    </div>
  );
};
