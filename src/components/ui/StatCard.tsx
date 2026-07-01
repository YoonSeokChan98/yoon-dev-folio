// 플로팅 통계 카드 — Hero 섹션 우측에 표시되는 수치 카드
interface StatCardProps {
  icon: string;
  value: string;
  label: string;
}

// @usage Hero.tsx 플로팅 스탯 영역 (Projects / Tech Stack / Since)
const StatCard = ({ icon, value, label }: StatCardProps) => (
  <div className="bg-white/80 backdrop-blur-md border border-blue-100 rounded-2xl px-5 py-4 shadow-lg shadow-blue-100/50 hover:-translate-y-1 transition-transform">
    <div className="text-xl mb-1">{icon}</div>
    <div className="text-2xl font-black text-[#0f172a]">{value}</div>
    <div className="text-[11px] text-slate-400 font-medium">{label}</div>
  </div>
);

export default StatCard;
