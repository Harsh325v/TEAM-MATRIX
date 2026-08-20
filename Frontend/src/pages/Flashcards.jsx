import { useMemo, useState } from 'react';
import { BrainCircuit, Check, ChevronLeft, ChevronRight, Lightbulb, RotateCcw } from 'lucide-react';
import { allSkills, flashcards } from '../data/mockData';
import { useProfile } from '../context/ProfileContext';

export default function Flashcards() {
  const { profile, reviewFlashcard } = useProfile();
  const [skillFilter, setSkillFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const subjects = useMemo(() => [...new Set(flashcards.map((card) => card.subject))], []);
  const prioritySkills = useMemo(() => Object.entries(profile.currentSkills)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)
    .map(([id]) => id), [profile.currentSkills]);
  const matchingCards = useMemo(() => flashcards.filter((card) =>
    (skillFilter === 'all' || card.skillId === skillFilter) &&
    (subjectFilter === 'all' || card.subject === subjectFilter)
  ), [skillFilter, subjectFilter]);
  const currentCard = matchingCards[cardIndex];
  const reviewed = profile.reviewedFlashcardIds || [];
  const known = profile.knownFlashcardIds || [];

  const changeFilter = (setFilter, value) => {
    setFilter(value);
    setCardIndex(0);
    setIsFlipped(false);
  };

  const move = (direction) => {
    setCardIndex((index) => (index + direction + matchingCards.length) % matchingCards.length);
    setIsFlipped(false);
  };

  const markCard = (isKnown) => {
    reviewFlashcard(currentCard.id, isKnown);
    if (cardIndex < matchingCards.length - 1) move(1);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1040px', margin: '0 auto' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title text-gradient">Smart flashcards</h1>
          <p className="text-muted">Review concepts matched to your skills and subjects. Start with your developing skills for the biggest impact.</p>
        </div>
        <div className="glass-panel" style={{ padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <BrainCircuit color="var(--accent)" size={22} />
          <span><strong>{known.length}</strong> mastered of {flashcards.length}</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '18px', marginBottom: '22px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
        <label className="text-muted" style={{ fontSize: '0.85rem' }}>Skill
          <select className="input-glass" value={skillFilter} onChange={(event) => changeFilter(setSkillFilter, event.target.value)} style={{ marginTop: '7px' }}>
            <option value="all">All skills</option>
            {allSkills.map((skill) => <option key={skill.id} value={skill.id}>{skill.name}{prioritySkills.includes(skill.id) ? ' · priority' : ''}</option>)}
          </select>
        </label>
        <label className="text-muted" style={{ fontSize: '0.85rem' }}>Subject
          <select className="input-glass" value={subjectFilter} onChange={(event) => changeFilter(setSubjectFilter, event.target.value)} style={{ marginTop: '7px' }}>
            <option value="all">All subjects</option>
            {subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
          </select>
        </label>
        <div style={{ alignSelf: 'end', fontSize: '0.9rem' }}><span style={{ color: 'var(--accent)', fontWeight: 600 }}>{reviewed.length}</span> cards reviewed</div>
      </div>

      {currentCard ? <>
        <div className="flashcard-shell" onClick={() => setIsFlipped((flipped) => !flipped)} role="button" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && setIsFlipped((flipped) => !flipped)}>
          <div className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}>
            <section className="flashcard-face flashcard-front">
              <span className="flashcard-tag">{currentCard.subject} · {currentCard.skill}</span>
              <h2>{currentCard.question}</h2>
              <p><RotateCcw size={16} /> Tap to reveal the answer</p>
            </section>
            <section className="flashcard-face flashcard-back">
              <span className="flashcard-tag">Answer</span>
              <p className="flashcard-answer">{currentCard.answer}</p>
              <p><RotateCcw size={16} /> Tap to see the question</p>
            </section>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button type="button" className="btn-secondary" onClick={() => move(-1)} aria-label="Previous flashcard"><ChevronLeft size={18} /> Previous</button>
          <span className="text-muted">{cardIndex + 1} of {matchingCards.length}</span>
          <button type="button" className="btn-secondary" onClick={() => move(1)}>Next <ChevronRight size={18} /></button>
        </div>
        {isFlipped && <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '22px', flexWrap: 'wrap' }}>
          <button type="button" className="btn-secondary" onClick={() => markCard(false)}><Lightbulb size={18} /> Review again</button>
          <button type="button" className="btn-primary" onClick={() => markCard(true)}><Check size={18} /> I know this</button>
        </div>}
      </> : <div className="glass-panel" style={{ padding: '42px', textAlign: 'center' }}><h3>No flashcards match these filters.</h3><p className="text-muted" style={{ marginTop: '8px' }}>Try another skill or subject.</p></div>}
    </div>
  );
}
