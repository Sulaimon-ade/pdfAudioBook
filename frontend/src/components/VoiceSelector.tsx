import React from 'react';
import { Mic } from 'lucide-react';

interface Voice {
  id: string;
  name: string;
}

const voices: Voice[] = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George' },
  { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel' }
];

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
  disabled?: boolean;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onVoiceChange,
  disabled = false
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-amber-900 mb-3">
        <Mic className="inline h-4 w-4 mr-2" />
        Choose Narrator Voice
      </label>
      <select
        value={selectedVoice}
        onChange={(e) => onVoiceChange(e.target.value)}
        disabled={disabled}
        className="
          w-full px-4 py-3 rounded-lg border border-amber-200 bg-cream
          text-amber-900 font-medium shadow-sm
          focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          appearance-none cursor-pointer
          hover:border-amber-300 transition-colors
        "
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23D2691E' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em'
        }}
      >
        <option value="">Select a voice...</option>
        {voices.map((voice) => (
          <option key={voice.id} value={voice.id}>
            {voice.name}
          </option>
        ))}
      </select>
    </div>
  );
};