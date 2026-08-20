import { useMemo } from 'react';
import SkillRadarChart from '../components/SkillRadarChart';
import RecommendationCard from '../components/RecommendationCard';
import RoadmapTimeline from '../components/RoadmapTimeline';
import { roles } from '../data/mockData';
import { calculateReadiness, calculateSkillGaps, getRecommendations, formatRadarData } from '../services/recommendationEngine';
import { useProfile } from '../context/ProfileContext';
import { TrendingUp, Award, Zap, CircleAlert, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const { profile: user, toggleRecommendation } = useProfile();
  const { recommendations, radarData, gaps, readiness } = useMemo(() => {
    const targetRoleId = roles.find((role) => role.name === user.targetRole)?.id || 'fullstack';
    const skillGaps = calculateSkillGaps(user.currentSkills, targetRoleId);
    return {
      gaps: skillGaps,
      recommendations: getRecommendations(skillGaps),
      radarData: formatRadarData(user.currentSkills, targetRoleId),
      readiness: calculateReadiness(user.currentSkills, targetRoleId),
    };
  }, [user.currentSkills, user.targetRole]);
  const completed = user.completedRecommendationIds || [];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="text-muted">Here is your personalized development plan to become a {user.targetRole}.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.875rem' }}>Current Role</div>
            <div style={{ fontWeight: 600 }}>{user.currentRole}</div>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '12px', borderRadius: '12px', color: 'var(--secondary)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.875rem' }}>Target Role</div>
            <div style={{ fontWeight: 600 }}>{user.targetRole}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(20, 184, 166, 0.2)', padding: '12px', borderRadius: '12px', color: 'var(--accent)' }}>
            <Zap size={24} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.875rem' }}>AI Readiness Score</div>
            <div style={{ fontWeight: 600, fontSize: '1.25rem' }}>{readiness}%</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main-col">
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <CircleAlert size={20} color="var(--secondary)" />
              <h3>Priority skill gaps</h3>
            </div>
            {gaps.length ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {gaps.slice(0, 4).map((gap) => (
                  <span key={gap.skillId} style={{ padding: '8px 10px', borderRadius: '999px', background: 'rgba(168, 85, 247, 0.14)', fontSize: '0.85rem' }}>
                    {gap.skillName}: level {gap.current} → {gap.required}
                  </span>
                ))}
              </div>
            ) : <p className="text-muted">You meet every requirement for this role. Pick a stretch goal to keep progressing.</p>}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.5rem' }}>Recommended actions</h2>
              <span className="text-muted">{completed.length} of {recommendations.length} completed</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {recommendations.map((rec, i) => (
                <div key={rec.id} className={`animate-fade-in animate-delay-${i + 1}`}>
                  <RecommendationCard resource={rec} completed={completed.includes(rec.id)} onToggle={() => toggleRecommendation(rec.id)} />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="dashboard-side-col">
          <SkillRadarChart data={radarData} />
          <RoadmapTimeline items={recommendations} completedIds={completed} />
          {completed.length > 0 && <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}><CheckCircle2 size={20} color="var(--accent)" /><span>{completed.length} action{completed.length === 1 ? '' : 's'} completed—keep the momentum going.</span></div>}
        </div>
      </div>
    </div>
  );
}
