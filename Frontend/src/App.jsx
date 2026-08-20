import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Goals from './pages/Goals';
import Flashcards from './pages/Flashcards';
import { ProfileProvider } from './context/ProfileContext';
import './App.css';

function App() {
  return (
    <ProfileProvider>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </ProfileProvider>
  );
}

export default App;
