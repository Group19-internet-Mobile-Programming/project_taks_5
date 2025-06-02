import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types
type VideoLink = {
  title: string;
  url: string;
};

type DiagnosticResult = {
  issue: string;
  confidence: number;
  description: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
  videoLinks?: VideoLink[];
};

type Diagnostic = {
  id: string;
  type: 'engine' | 'dashboard';
  title: string;
  date: string;
  status: 'pending' | 'completed';
  result?: DiagnosticResult;
};

type DiagnosticsContextType = {
  history: Diagnostic[];
  addDiagnostic: (diagnostic: Diagnostic) => void;
  getDiagnosticById: (id: string) => Diagnostic | null;
};

// Create context
const DiagnosticsContext = createContext<DiagnosticsContextType | undefined>(undefined);

// Provider component
export default function DiagnosticsProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<Diagnostic[]>([]);

  // Initialize with some sample data
  useEffect(() => {
    setHistory([
      {
        id: '1',
        type: 'engine',
        title: 'Engine Sound Analysis',
        date: '2023-09-15T14:48:00.000Z',
        status: 'completed',
        result: {
          issue: 'Timing Belt Noise',
          confidence: 92,
          description: 'The audio analysis detected sounds consistent with a worn timing belt or tensioner. This can lead to engine performance issues if not addressed.',
          recommendation: 'Have your timing belt and tensioner inspected and replaced if necessary. This is a critical maintenance item.',
          severity: 'medium',
          videoLinks: [
            {
              title: 'How to Diagnose Timing Belt Noise',
              url: 'https://www.youtube.com/watch?v=example1'
            }
          ]
        }
      },
      {
        id: '2',
        type: 'dashboard',
        title: 'Dashboard Light Check',
        date: '2023-09-10T10:30:00.000Z',
        status: 'completed',
        result: {
          issue: 'Check Engine Light',
          confidence: 98,
          description: 'The check engine light indicates an issue with your engine or emissions system that needs attention.',
          recommendation: 'Connect an OBD-II scanner to retrieve the specific error code. Common causes include oxygen sensor failure, loose gas cap, or catalytic converter issues.',
          severity: 'medium',
          videoLinks: [
            {
              title: 'Understanding Check Engine Light',
              url: 'https://www.youtube.com/watch?v=example2'
            }
          ]
        }
      }
    ]);
  }, []);

  const addDiagnostic = (diagnostic: Diagnostic) => {
    setHistory(prev => [diagnostic, ...prev]);
  };

  const getDiagnosticById = (id: string) => {
    return history.find(item => item.id === id) || null;
  };

  return (
    <DiagnosticsContext.Provider value={{ history, addDiagnostic, getDiagnosticById }}>
      {children}
    </DiagnosticsContext.Provider>
  );
}

// Custom hook for using diagnostics context
export function useDiagnosticsContext() {
  const context = useContext(DiagnosticsContext);
  if (context === undefined) {
    throw new Error('useDiagnosticsContext must be used within a DiagnosticsProvider');
  }
  return context;
}