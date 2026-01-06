import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import LobbyView from '../components/quiz/LobbyView';
import QuestionView from '../components/quiz/QuestionView';
import ResultView from '../components/quiz/ResultView';
import { Loader2 } from 'lucide-react';

const QuizPage = () => {
    const { roomCode } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { isHost, name, quizId } = location.state || {};

    const [players, setPlayers] = useState([]);
    const [status, setStatus] = useState('lobby'); // lobby, active, ended
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [distribution, setDistribution] = useState([0, 0, 0, 0]);
    const [finalQuestions, setFinalQuestions] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRevealing, setIsRevealing] = useState(false);

    const { emit, on } = useSocket(roomCode);

    useEffect(() => {
        if (!roomCode) {
            navigate('/');
            return;
        }

        // Join logic
        if (isHost) {
            emit('host:create_room', { quizId });
            setIsLoading(false);
        } else if (name) {
            emit('guest:join_room', { name });
            setIsLoading(false);
        } else {
            // If someone refreshes or navigates directly without state
            navigate('/join');
        }

        // Listeners
        on('room_state_updated', (data) => {
            setPlayers(data.players);
            setStatus(data.status);
        });

        on('quiz_started', () => {
            setStatus('active');
        });

        on('question_started', (data) => {
            setStatus('active');
            setCurrentQuestion(data);
            setDistribution([0, 0, 0, 0]); // Reset distribution for new question
            setIsRevealing(false);
        });

        on('leaderboard_updated', (data) => {
            setLeaderboard(data);
        });

        on('answer_distribution_updated', (data) => {
            setDistribution(data.distribution);
        });

        on('all_players_answered', () => {
            console.log('[DEBUG] Received all_players_answered');
            if (isHost) {
                handleRevealAndAdvance();
            }
        });

        on('reveal_answer', (data) => {
            console.log('[DEBUG] Received reveal_answer', data);
            if (data && data.correctOptionIndex !== undefined) {
                setCurrentQuestion(prev => ({
                    ...prev,
                    correctOptionIndex: data.correctOptionIndex
                }));
            }
            setIsRevealing(true);
        });

        on('quiz_ended', (data) => {
            setStatus('ended');
            setLeaderboard(data.leaderboard);
            setFinalQuestions(data.questions);
            setIsRevealing(false);
        });

        on('error', (err) => {
            setError(err.message);
        });

        return () => {
            // Socket disconnect is handled in the hook
        };
    }, [roomCode]);

    const handleStartQuiz = () => {
        emit('host:start_quiz', {});
    };

    const handleAnswer = (selectedIdx, timeTakenMs) => {
        emit('guest:submit_answer', {
            questionId: currentQuestion.questionId,
            selectedOptionIndex: selectedIdx,
            timeTakenMs
        });
    };

    const handleNextQuestion = () => {
        emit('host:next_question', {});
    };

    const handleRevealAndAdvance = () => {
        // First trigger reveal
        emit('host:reveal_answer', { roomCode });

        // Then wait for next question
        setTimeout(() => {
            handleNextQuestion();
        }, 3000); // 3 seconds to see the result
    };

    const handleTimeout = () => {
        if (isHost) {
            handleRevealAndAdvance();
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <div className="glass p-8 max-w-md">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <button onClick={() => navigate('/')} className="bg-slate-800 px-6 py-2 rounded-lg">Back Home</button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {status === 'lobby' && (
                <LobbyView
                    players={players}
                    isHost={isHost}
                    onStart={handleStartQuiz}
                    roomCode={roomCode}
                />
            )}

            {status === 'active' && currentQuestion && (
                <div className="relative">
                    <QuestionView
                        question={currentQuestion}
                        onAnswer={handleAnswer}
                        onTimeout={handleTimeout}
                        questionIndex={currentQuestion.questionIndex}
                        totalQuestions={currentQuestion.totalQuestions}
                        isHost={isHost}
                        distribution={distribution}
                        isRevealing={isRevealing}
                    />
                    {isHost && (
                        <div className="fixed bottom-8 right-8">
                            <button
                                onClick={handleRevealAndAdvance}
                                className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-xl font-bold transition-all shadow-xl shadow-indigo-500/20"
                            >
                                Next Question
                            </button>
                        </div>
                    )}
                </div>
            )}

            {status === 'ended' && (
                <ResultView
                    leaderboard={leaderboard}
                    questions={finalQuestions}
                    name={name}
                    isHost={isHost}
                />
            )}
        </div>
    );
};

export default QuizPage;
