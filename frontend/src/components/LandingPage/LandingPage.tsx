import MainLayout from '@/components/MainLayout';
import Herosection from './LandingPageSections/Herosection';
import Blogsection from './LandingPageSections/Blogsection';
import Peoplesection from './LandingPageSections/Peoplesection';
import Productsection from './LandingPageSections/Productsection';
import DoctorsReview from './LandingPageSections/DoctorsReview';
import Chapter1 from './LandingPageSections/Chapter1';
import Chapter2 from './LandingPageSections/Chapter2';
import Chapter3 from './LandingPageSections/Chapter3';
import FAQSection from './LandingPageSections/FAQSection';

const LANDING_PAGE_FAQS = [
  { q: 'How can we consume it?', a: 'Mix one sachet with water or milk, shake well, and drink. With water → light and easy to digest. With milk → more filling and richer. No preparation needed. Just mix and go.' },
  { q: 'Is there any specific timing to have it?', a: 'There is no strict timing. You can take it in the morning, after a workout, or between meals. What matters most is taking it consistently every day.' },
  { q: 'How much should I consume in a day?', a: 'Typically, 1–2 sachets per day. 1 sachet → for basic daily nutrition. 2 sachets → for higher protein needs or active lifestyles. Stay within the recommended intake.' },
  { q: 'Will I not overdose micronutrients?', a: 'No, when taken as recommended. The formulation is designed to stay within safe daily limits, even with regular use.' },
  { q: 'Do we need doctors prescription for this?', a: 'No. This is a nutritional product, not a medicine. You can consume it as part of your daily diet.' },
  { q: 'Why there are not many flavours?', a: 'Because the focus is on clean and effective formulation. More flavours usually mean more artificial additives. Keeping it minimal helps maintain better ingredient quality.' },
  { q: 'How is it better for weight loss?', a: 'It supports weight loss by making your diet easier to manage: Helps you feel full for longer, Reduces unnecessary snacking, Supports a calorie-controlled diet. It supports your goal — it doesn\'t replace effort.' },
];

export default function LandingPage() {
  return (
    <MainLayout background="var(--background)">
        <Herosection />
        <Chapter1 />
        <Chapter2 />
        <Chapter3 />
        <Productsection />
        <Blogsection />
        <Peoplesection />
        <DoctorsReview />
        <FAQSection 
          title="Common Questions"
          subtitle="Helping you make sense of the daily sachet ✨"
          faqs={LANDING_PAGE_FAQS}
        />
    </MainLayout>
  );
}
