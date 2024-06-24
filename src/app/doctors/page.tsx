'use client';

import { FormControlLabel, MenuItem, Switch, TextField, Typography } from '@mui/material';
import states from '../us-states.json';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DoctorsForm, doctorsFormSchema } from '@/app/doctors/doctors-form-schema';
import { useFormState, useFormStatus } from 'react-dom';
import { searchDoctors } from '@/app/lib/actions/searchDoctors';
import { FC, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { DoctorsTable } from '@/app/doctors/doctors-table';

export default function Doctors() {
  const {
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<DoctorsForm>({
    mode: 'all',
    resolver: zodResolver(doctorsFormSchema)
  });

  const [state, submitAction] = useFormState(searchDoctors, { errors: {}, data: undefined, message: '' });
  const [didSearch, setDidSearch] = useState<boolean>(false);

  const { firstName, lastName, withState } = watch();

  return (
    <>
      <section>
        <h1 className="text-2xl text-center font-semibold mb-8">Search doctors across the United States</h1>

        <form
          className="flex flex-wrap gap-4 w-full max-w-[600px] mx-auto"
          action={submitAction}
          onSubmit={() => {
            trigger();
            setDidSearch(true);
          }}
          noValidate
        >
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <TextField
                {...field} variant="outlined" required label="First Name"
                className="flex-auto"
                error={!!errors.firstName}
                disabled={didSearch}
              />
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <TextField
                {...field} variant="outlined" required label="Last Name"
                className="flex-auto" error={!!errors.lastName}
                disabled={didSearch}
              />
            )}
          />

          <div className="flex flex-col gap-2 flex-[1_1_100%]">
            <Controller
              control={control}
              defaultValue={false}
              name="withState"
              render={({ field: { onChange, ...field } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      {...field}
                      disabled={didSearch}
                      onChange={(event, checked) => {
                        onChange(event);
                        if (!checked) trigger('state');
                      }}/>
                  }
                  label="Narrow the search by state"
                />
              )}
            />
            <Controller
              control={control}
              name="state"
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="State"
                  fullWidth
                  required={withState}
                  disabled={!withState}
                  error={!!errors.state}
                  helperText={!!errors.state?.message ? <span>{errors.state.message}</span> : null}
                >
                  {
                    states.map((state) => (
                      <MenuItem key={state.abbreviation} value={state.abbreviation}>
                        {state.name} ({state.abbreviation})
                      </MenuItem>
                    ))
                  }
                </TextField>
              )}
            />
          </div>

          <SubmitButton didSearch={didSearch} onNewSearchClick={() => setDidSearch(false)}/>


          {state.errors && Object.keys(state.errors).length > 0
            ? <p className="text-red-500">Please check the form data</p> : null
          }
        </form>
      </section>

      {
        didSearch && <section className="pt-8">
          {state.data ? <DoctorsTable data={state.data} searchedName={`${firstName} ${lastName}`}/> : null}
        </section>
      }
    </>
  );
}

const SubmitButton: FC<{ didSearch: boolean, onNewSearchClick: () => void }> = ({ didSearch, onNewSearchClick }) => {
  const { pending } = useFormStatus();

  return (
    <div className="w-full">
      <LoadingButton
        variant="contained"
        type="submit"
        fullWidth
        className="mt-4"
        loading={pending}
      >
        Search
      </LoadingButton>
      {didSearch && !pending &&
        <Typography variant="caption" component="button" className="font-sans underline" onClick={onNewSearchClick}>New
          search</Typography>}
    </div>
  );
};
