import {redirect} from 'next/navigation';

// Root / is handled by middleware locale detection.
// This fallback redirects in case middleware is bypassed.
export default function RootPage() {
  redirect('/de');
}
