import { Masks } from '@mui/icons-material';
import Link from 'next/link';

export default function Home() {
  return (
    <section className="flex flex-col items-center">
      <h1 className="text-2xl">This is the search tool of Titan Intake</h1>
      <h2>Please select an option below to start your search</h2>

      <div className="flex flex-col items-center gap-y-4 md:gap-y-6 mt-8">
        <Link href="doctors">
          <button className="flex items-center gap-x-3 p-8 shadow rounded hover:cursor-pointer">
            <Masks/>
            Search Doctors
          </button>
        </Link>
        <button>Search Clinics</button>
      </div>
    </section>
  );
}
