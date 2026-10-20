import { HubBuyerQuestionsBlock } from './ProductUkBuyerSection';
import { getHubBuyerQuestions } from '../../lib/ukBuyerQuestions';

type HubBuyerQuestionsPanelProps = {
  path: string;
  heading?: string;
  className?: string;
};

export function HubBuyerQuestionsPanel({ path, heading, className = '' }: HubBuyerQuestionsPanelProps) {
  const faqs = getHubBuyerQuestions(path);
  return <HubBuyerQuestionsBlock faqs={faqs} heading={heading} className={className} />;
}
