import { io } from 'socket.io-client';
import { useEffect, useRef } from 'react';

export const useSocket = (roomCode) => {
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io('http://localhost:5000/quiz');

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const emit = (event, data) => {
        if (socketRef.current) {
            socketRef.current.emit(event, { ...data, roomCode });
        }
    };

    const on = (event, callback) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    };

    return { emit, on };
};
