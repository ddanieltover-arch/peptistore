import { Link } from 'react-router-dom';

type RelatedLink = {
  to: string;
  label: string;
};

const defaultLinks: RelatedLink[] = [
  { to: '/coas', label: 'peptide COA library' },
  { to: '/peptide-research', label: 'peptide research UK' },
  { to: '/peptide-guide', label: 'research peptide guide' },
  { to: '/shop', label: 'research peptide catalog' },
];

type RelatedResearchLinksProps = {
  links?: RelatedLink[];
  className?: string;
};

export function RelatedResearchLinks({ links = defaultLinks, className = '' }: RelatedResearchLinksProps) {
  return (
    <nav
      aria-label="Related research resources"
      className={`text-sm text-gray-600 leading-relaxed ${className}`}
    >
      {links.map((link, index) => (
        <span key={link.to}>
          {index > 0 && <span className="text-gray-400"> · </span>}
          <Link to={link.to} className="text-blue-600 font-semibold hover:underline">
            {link.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
