import { redirect } from 'next/navigation';

export default function RootPage() {
  // redirect to the en locale with the "always" prefix strategy
  redirect('/en');
}
