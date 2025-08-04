import React, { useState } from 'react';
import { BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { VoiceSelector } from './components/VoiceSelector';
import { AudioPlayer } from './components/AudioPlayer';
import { LoadingSpinner } from './components/LoadingSpinner';

type AppState = 'idle' | 'processing' | 'success' | 'error';

interface AppData {
  selectedFile: File | null;
  selectedVoice: string;
  audioUrl: string;
  errorMessage: string;
  ttsEngine: 'basic' | 'human-like';
}

function App() {
  const [state, setState] = useState<AppState>('idle');
  const [data, setData] = useState<AppData>({
    selectedFile: null,
    selectedVoice: '',
    audioUrl: '',
    errorMessage: '',
    ttsEngine: 'basic'
  });

  const handleFileSelect = (file: File | null) => {
    setData(prev => ({ ...prev, selectedFile: file }));
    if (state === 'error') setState('idle');
  };

  const handleVoiceChange = (voiceId: string) => {
    setData(prev => ({ ...prev, selectedVoice: voiceId }));
    if (state === 'error') setState('idle');
  };

  const handleSubmit = async () => {
    if (!data.selectedFile || !data.selectedVoice) {
      setData(prev => ({ ...prev, errorMessage: 'Please select a PDF file and voice' }));
      setState('error');
      return;
    }

    setState('processing');

    try {
      const formData = new FormData();
      formData.append('file', data.selectedFile);
      formData.append('voice_id', data.selectedVoice);

      const route = data.ttsEngine === 'basic' ? '/upload-google' : '/upload';

      const response = await fetch(route, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      setData(prev => ({ ...prev, audioUrl }));
      setState('success');
    } catch (error) {
      setData(prev => ({
        ...prev,
        errorMessage: error instanceof Error ? error.message : 'An unexpected error occurred'
      }));
      setState('error');
    }
  };


  const resetApp = () => {
    setState('idle');
    setData({
      selectedFile: null,
      selectedVoice: '',
      audioUrl: '',
      errorMessage: '',
      ttsEngine: 'basic'
    });
  };

  const canProcess = data.selectedFile && data.selectedVoice && state !== 'processing';
  console.log({
    selectedFile: data.selectedFile,
    selectedVoice: data.selectedVoice,
    state,
    canProcess
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream to-amber-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-800 to-amber-900 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-cream" />
            <h1 className="text-2xl md:text-3xl font-bold text-cream">
              PDF to Audiobook Converter
            </h1>
          </div>
          <p className="text-amber-100 mt-2">
            Transform your PDF books into immersive audiobooks with AI narration
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {state === 'success' ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Success!</h3>
                <p className="text-green-700">Your audiobook is ready to play</p>
              </div>
            </div>

            <AudioPlayer
              audioUrl={data.audioUrl}
              fileName={data.selectedFile?.name || 'audiobook'}
            />

            <div className="text-center">
              <button
                onClick={resetApp}
                className="px-6 py-3 bg-amber-800 text-cream rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                Convert Another Book
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8 border border-amber-200">
            {state === 'processing' ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-8">
                {/* Error Message */}
                {state === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                    <div>
                      <h3 className="font-semibold text-red-800">Error</h3>
                      <p className="text-red-700">{data.errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* File Upload */}
                <div>
                  <h2 className="text-xl font-bold text-amber-900 mb-4">
                    1. Upload Your PDF Book
                  </h2>
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    selectedFile={data.selectedFile}
                    isProcessing={state === 'processing'}
                  />
                </div>

                {/* Voice Selection */}
                <div>
                  <h2 className="text-xl font-bold text-amber-900 mb-4">
                    2. Select Narrator Voice
                  </h2>
                  <VoiceSelector
                    selectedVoice={data.selectedVoice}
                    onVoiceChange={handleVoiceChange}
                    disabled={state === 'processing'}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-amber-900 mb-4">
                    3. Choose Voice Engine
                  </h2>
                  <select
                    className="border border-amber-300 rounded px-3 py-2 text-amber-900 w-full"
                    value={data.ttsEngine}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        ttsEngine: e.target.value as 'basic' | 'human-like'
                      }))
                    }
                    disabled={state === 'processing'}
                  >
                    <option value="basic">Basic voice (Free)</option>
                    <option value="human-like">Human like (Premium)</option>
                  </select>
                </div>


                {/* Convert Button */}
                <div className="pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={!canProcess}
                    className={`
                      w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300
                      ${canProcess
                        ? 'bg-gradient-to-r from-amber-800 to-amber-900 text-cream hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    {state === 'processing' ? 'Converting...' : 'Convert to Audiobook'}
                  </button>

                  {canProcess && (
                    <p className="text-center text-amber-600 text-sm mt-3">
                      Processing may take several minutes for large files
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-amber-900 text-cream py-6 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-amber-200">
            Powered by iServices integrated limited AI Voice Technology
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;