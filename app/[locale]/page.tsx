import { useTranslations } from 'next-intl';
import HeroVideo from '@/components/HeroVideo';
import MembershipPitch from '@/components/MembershipPitch';
import FleetPreviewSection from '@/components/FleetPreviewSection';
import HowItWorks from '@/components/HowItWorks';
import Stats from '@/components/Stats';
import AppShowcase from '@/components/AppShowcase';
import Destinations from '@/components/Destinations';
import LifestyleGallery from '@/components/LifestyleGallery';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTAFinal from '@/components/CTAFinal';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('home');

  const steps = [
    {
      number: t('howItWorks.step1.number'),
      title: t('howItWorks.step1.title'),
      desc: t('howItWorks.step1.desc'),
    },
    {
      number: t('howItWorks.step2.number'),
      title: t('howItWorks.step2.title'),
      desc: t('howItWorks.step2.desc'),
    },
    {
      number: t('howItWorks.step3.number'),
      title: t('howItWorks.step3.title'),
      desc: t('howItWorks.step3.desc'),
    },
  ];

  return (
    <>
      <HeroVideo
        tagline={t('hero.tagline')}
        subtitle={t('hero.subtitle')}
        cta={t('hero.cta')}
        locale={locale}
      />

      <MembershipPitch
        eyebrow={t('pitch.eyebrow')}
        title={t('pitch.title')}
        description={t('pitch.description')}
        cta={t('pitch.cta')}
        locale={locale}
      />

      <FleetPreviewSection
        eyebrow={t('fleet.eyebrow')}
        title={t('fleet.title')}
        viewAll={t('fleet.viewAll')}
        locale={locale}
      />

      <HowItWorks
        eyebrow={t('howItWorks.eyebrow')}
        title={t('howItWorks.title')}
        steps={steps}
      />

      <Stats locale={locale} />

      <AppShowcase locale={locale} />

      <Destinations locale={locale} />

      <LifestyleGallery title={t('gallery.title')} />

      <TestimonialsSection locale={locale} />

      <CTAFinal
        eyebrow={t('cta.eyebrow')}
        title={t('cta.title')}
        description={t('cta.description')}
        button={t('cta.button')}
        locale={locale}
      />
    </>
  );
}
