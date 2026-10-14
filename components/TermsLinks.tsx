'use client';

import {useTranslations} from 'next-intl';

type Props = {
  /** The full terms page: `${home}${TERMS_PATH}`, or the bare relative TERMS_PATH where no home is known (Contact). */
  termsHref: string;
  /** Root-relative PDF copy of the same terms (lib/site.ts TERMS_PDF). */
  pdfHref: string;
};

/**
 * One line, two links: the full terms and their PDF. It sits directly above
 * the submit button of the order page and of the contact form, so every order
 * and every enquiry has the terms within reach before it is sent. Both links
 * open in a new tab so a half-filled form is not lost.
 */
export default function TermsLinks({termsHref, pdfHref}: Props) {
  const t = useTranslations('order.termsLinks');
  const newTab = <span className="sr-only"> {t('newTab')}</span>;
  return (
    <p className="order-terms-links">
      <a href={termsHref} target="_blank" rel="noopener noreferrer">{t('read')}{newTab}</a>
      <span aria-hidden="true"> · </span>
      <a href={pdfHref} target="_blank" rel="noopener noreferrer">{t('pdf')}{newTab}</a>
    </p>
  );
}
