import HelpStats from '../content/HelpStats';

interface StatsSectionProps {
  totalHelps: number;
  openHelps: number;
  connectingHelps: number;
}

export default function StatsSection({ totalHelps, openHelps, connectingHelps }: StatsSectionProps) {
  return (
    <HelpStats 
      totalHelps={totalHelps}
      openHelps={openHelps}
      connectingHelps={connectingHelps}
    />
  );
} 