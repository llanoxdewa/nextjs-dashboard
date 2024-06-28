"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';



// this is used for typed check
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'please sleect an customer !'
  }),
  amount: z.coerce.number().gt(0, {
    message: 'amount must bigger than 0'
  }), // memaksa mengubah data menjadi type number
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'status not valid !!'
  }),
  date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};


const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {

  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })


  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // extract data from validateFields object
  const { customerId, amount, status } = validatedFields.data

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];


  try {

    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return { message: '[database error]: Failed to create invoices' }
  }

  revalidatePath('dashboard/invoices')
  redirect('/dashboard/invoices')

}


// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });


export async function updateInvoice(prevState: State, formData: FormData, id: string) {

  const validateFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });


  !validateFields.success && console.log(validateFields.error.flatten())

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: 'missing / error fields: Failed to update invoice.'
    }
  }


  const { customerId, amount, status } = validateFields.data

  const amountInCents = amount * 100;

  try {

    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: '[database error]: Failed to udpate invoices' }
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export async function deleteInvoice(id: string) {


  try {

    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    return { message: '[database error]: failed to remove invoice' }

  }
  revalidatePath('/dashboard/invoices');
}




export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
