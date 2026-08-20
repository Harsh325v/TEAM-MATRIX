import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roles, allSkills } from '../data/mockData';
import { ArrowRight } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

export default function Assessment() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const [targetRole, setTargetRole] = useState(profile.targetRole);
  const [skills, setSkills] = useState(profile.currentSkills);

  const handleSkillChange = (skillId, val) => {
    setSkills(prev => ({ ...prev, [skillId]: parseInt(val) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ targetRole, currentSkills: skills, completedRecommendationIds: [] });
    navigate('/');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1 className="page-title text-gradient">Skill Assessment</h1>
        <p className="text-muted">Update your skills and career goals to get personalized recommendations.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px' }}>Career Goal</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="text-muted" style={{ fontSize: '0.875rem' }}>Select Target Role</label>
            <select 
              className="input-glass" 
              value={targetRole} 
              onChange={(e) => setTargetRole(e.target.value)}
              style={{ appearance: 'none' }}
            >
              {roles.map(role => (
                <option key={role.id} value={role.name} style={{ background: 'var(--bg-dark)', color: 'white' }}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h3 style={{ marginBottom: '24px' }}>Self Assessment (1: Novice, 5: Expert)</h3>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          {allSkills.map(skill => (
            <div key={skill.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
              <div>
                <div style={{ fontWeight: 500 }}>{skill.name}</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{skill.category}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="range" 
                  min="0" max="5" 
                  value={skills[skill.id] || 0} 
                  onChange={(e) => handleSkillChange(skill.id, e.target.value)}
                  style={{ width: '150px' }}
                />
                <span style={{ width: '20px', textAlign: 'center', fontWeight: 600, color: 'var(--primary)' }}>
                  {skills[skill.id] || 0}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save & Generate Plan <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
