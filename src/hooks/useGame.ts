import { useState, useEffect } from 'react';
import planesData from '../data/planes.json';
import { Plane } from '../types/plane';

type GuessResult = {
  manufacturer: 'correct' | 'incorrect';
  maxRange: 'up' | 'down' | 'correct';
  engineCount: 'up' | 'down' | 'correct';
  productionYear: 'up' | 'down' | 'correct';
  totalProduced: 'up' | 'down' | 'correct';
};

type GameState = {
  targetPlane: Plane | null;
  guesses: Array<{ plane: Plane; result: GuessResult }>;
  gameOver: boolean;
  won: boolean;
  remainingGuesses: number;
};

type GuessResponse = {
  error?: string;
  success: boolean;
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    targetPlane: null,
    guesses: [],
    gameOver: false,
    won: false,
    remainingGuesses: 6,
  });

  // Oyunu başlat
  const startGame = () => {
    const randomIndex = Math.floor(Math.random() * planesData.length);
    setGameState({
      targetPlane: planesData[randomIndex] as Plane,
      guesses: [],
      gameOver: false,
      won: false,
      remainingGuesses: 6,
    });
  };

  // Tahmin sonucunu değerlendir
  const evaluateGuess = (guessedPlane: Plane): GuessResult => {
    if (!gameState.targetPlane) return {} as GuessResult;

    return {
      manufacturer: guessedPlane.manufacturer === gameState.targetPlane.manufacturer ? 'correct' : 'incorrect',
      maxRange: guessedPlane.maxRange === gameState.targetPlane.maxRange 
        ? 'correct' 
        : guessedPlane.maxRange < gameState.targetPlane.maxRange ? 'up' : 'down',
      engineCount: guessedPlane.engineCount === gameState.targetPlane.engineCount 
        ? 'correct' 
        : guessedPlane.engineCount < gameState.targetPlane.engineCount ? 'up' : 'down',
      productionYear: guessedPlane.productionYear === gameState.targetPlane.productionYear 
        ? 'correct' 
        : guessedPlane.productionYear < gameState.targetPlane.productionYear ? 'up' : 'down',
      totalProduced: guessedPlane.totalProduced === gameState.targetPlane.totalProduced 
        ? 'correct' 
        : guessedPlane.totalProduced < gameState.targetPlane.totalProduced ? 'up' : 'down',
    };
  };

  // Tahmin yap
  const makeGuess = (planeModel: string): GuessResponse => {
    if (gameState.gameOver || !gameState.targetPlane) {
      return { success: false, error: 'Oyun zaten bitmiş!' };
    }

    const guessedPlane = planesData.find(plane => plane.model.toLowerCase() === planeModel.toLowerCase());
    
    if (!guessedPlane) {
      return { success: false, error: 'Uçak veritabanında bulunamadı!' };
    }

    const result = evaluateGuess(guessedPlane as Plane);
    const newGuesses = [...gameState.guesses, { plane: guessedPlane as Plane, result }];
    const remainingGuesses = gameState.remainingGuesses - 1;
    
    // Kazanma durumunu kontrol et
    const isWin = guessedPlane.model === gameState.targetPlane.model;

    setGameState(prev => ({
      ...prev,
      guesses: newGuesses,
      gameOver: isWin || remainingGuesses === 0,
      won: isWin,
      remainingGuesses,
    }));

    return { success: true };
  };

  // Oyunu başlat
  useEffect(() => {
    startGame();
  }, []);

  return {
    gameState,
    makeGuess,
    startGame,
  };
}; 