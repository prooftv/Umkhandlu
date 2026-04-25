'use client';

import type { SanityDocument } from 'next-sanity';
import { useOptimistic } from 'next-sanity/hooks';
import type { ElementType } from 'react';
import { dataAttr } from '@/lib/sanity/client/utils';
import type { SectionsType } from '@/lib/sanity/queries/fragments/fragment.types';
import AdBanner from './AdBanner';
import CardGrid from './CardGrid';
import ContactForm from './ContactForm';
import CTA from './CTA';
import Divider from './Divider';
import Embed from './Embed';
import FAQ from './FAQ';
import Gallery from './Gallery';
import Hero from './Hero';
import ListingGrid from './ListingGrid';
import LogoGrid from './LogoGrid';
import MediaText from './MediaText';
import NoticeList from './NoticeList';
import OpportunityList from './OpportunityList';
import PostList from './PostList';
import Process from './Process';
import ProgramList from './ProgramList';
import Quote from './Quote';
import RecordList from './RecordList';
import RichText from './RichText';
import Stats from './Stats';
import Subscribe from './Subscribe';
import TeamGrid from './TeamGrid';

const SECTION_COMPONENTS: Record<string, ElementType> = {
  adBanner: AdBanner,
  hero: Hero,
  mediaText: MediaText,
  cta: CTA,
  subscribe: Subscribe,
  postList: PostList,
  cardGrid: CardGrid,
  contactForm: ContactForm,
  divider: Divider,
  embed: Embed,
  faq: FAQ,
  gallery: Gallery,
  listingGrid: ListingGrid,
  logoGrid: LogoGrid,
  noticeList: NoticeList,
  opportunityList: OpportunityList,
  process: Process,
  programList: ProgramList,
  quote: Quote,
  recordList: RecordList,
  richText: RichText,
  stats: Stats,
  teamGrid: TeamGrid,
} as const;

type PageSectionsProps = {
  documentId: string;
  documentType: string;
  sections?: SectionsType;
};

type PageData = SanityDocument<{
  pageSections?: SectionsType;
}>;

export default function PageSections({
  documentId,
  documentType,
  sections: initialSections = [],
}: PageSectionsProps) {
  const sections = useOptimistic<SectionsType, PageData>(
    initialSections ?? [],
    (currentSections, action) => {
      if (action.id !== documentId || !action?.document?.pageSections) {
        return currentSections;
      }

      return action.document.pageSections.map(
        (section) =>
          currentSections?.find(
            (currentSection) => currentSection._key === section?._key
          ) || section
      );
    }
  );

  if (!sections?.length) {
    return null;
  }

  return (
    <div
      data-sanity={dataAttr({
        id: documentId,
        type: documentType,
        path: 'pageSections',
      })}
    >
      {sections?.map((section) => {
        const { _key, _type, ...sectionProps } = section;
        const SectionComponent = SECTION_COMPONENTS[_type];

        if (!SectionComponent) {
          return (
            <div
              key={_key}
              className="flex items-center justify-center p-8 my-8 text-center text-muted-foreground bg-muted rounded-lg"
            >
              Component not found for block type: <code>{_type}</code>
            </div>
          );
        }

        return (
          <div
            key={_key}
            data-sanity={dataAttr({
              id: documentId,
              type: documentType,
              path: `pageSections[_key=="${_key}"]`,
            })}
          >
            <SectionComponent section={sectionProps} />
          </div>
        );
      })}
    </div>
  );
}
