import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for train schedule simulation
 * Handles simulation state, time progression, and train movements
 */
export function useSimulation(lichTrinh, duongRay) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1); // 1x, 2x, 5x, 10x
    const [currentTime, setCurrentTime] = useState(null); // Simulation time
    const [trainStates, setTrainStates] = useState([]); // Current state of all trains
    const [events, setEvents] = useState([]); // Event log
    const intervalRef = useRef(null);

    // Initialize simulation
    const initializeSimulation = useCallback(() => {
        if (!lichTrinh || lichTrinh.length === 0) return;

        // Find earliest time from all schedules
        const times = lichTrinh
            .map(lt => new Date(lt.gioDenDuKien || lt.gioDiDuKien))
            .filter(t => !isNaN(t));

        if (times.length === 0) return;

        const earliestTime = new Date(Math.min(...times));
        // Start 30 minutes before earliest train
        earliestTime.setMinutes(earliestTime.getMinutes() - 30);

        setCurrentTime(earliestTime);

        // Initialize train states
        const initialStates = lichTrinh.map(lt => ({
            maLichTrinh: lt.maLichTrinh,
            maChuyenTau: lt.maChuyenTau,
            maRay: lt.maRay,
            status: 'WAITING', // WAITING, APPROACHING, ARRIVED, DEPARTING, DEPARTED
            gioDenDuKien: new Date(lt.gioDenDuKien),
            gioDiDuKien: new Date(lt.gioDiDuKien),
            gioDenThucTe: null,
            gioDiThucTe: null,
            soPhutTre: 0,
            position: 0 // 0-100% for animation
        }));

        setTrainStates(initialStates);
        setEvents([{
            time: earliestTime,
            type: 'SYSTEM',
            message: 'Bắt đầu mô phỏng lịch trình',
            severity: 'info'
        }]);
    }, [lichTrinh]);

    // Update simulation state
    const updateSimulation = useCallback(() => {
        if (!currentTime) return;

        const newTime = new Date(currentTime);
        newTime.setMinutes(newTime.getMinutes() + 1); // Advance 1 minute
        setCurrentTime(newTime);

        // Update train states
        setTrainStates(prevStates => {
            const newStates = [...prevStates];
            const newEvents = [];

            newStates.forEach(train => {
                const timeToDen = (train.gioDenDuKien - newTime) / (1000 * 60); // minutes
                const timeToDi = (train.gioDiDuKien - newTime) / (1000 * 60);

                // State transitions
                if (train.status === 'WAITING' && timeToDen <= 10 && timeToDen > 0) {
                    train.status = 'APPROACHING';
                    train.position = 10;
                    newEvents.push({
                        time: newTime,
                        type: 'TRAIN',
                        trainId: train.maChuyenTau,
                        message: `Tàu ${train.maChuyenTau} đang tiến vào ga (còn ${Math.floor(timeToDen)} phút)`,
                        severity: 'info'
                    });
                }

                if (train.status === 'APPROACHING' && timeToDen <= 0) {
                    train.status = 'ARRIVED';
                    train.gioDenThucTe = newTime;
                    train.position = 50;

                    // Calculate delay
                    const delayMinutes = Math.floor((newTime - train.gioDenDuKien) / (1000 * 60));
                    train.soPhutTre = Math.max(0, delayMinutes);

                    newEvents.push({
                        time: newTime,
                        type: 'ARRIVAL',
                        trainId: train.maChuyenTau,
                        message: `Tàu ${train.maChuyenTau} đã đến ga${train.soPhutTre > 0 ? ` (trễ ${train.soPhutTre} phút)` : ' (đúng giờ)'}`,
                        severity: train.soPhutTre > 0 ? 'warning' : 'success'
                    });
                }

                if (train.status === 'ARRIVED' && timeToDi <= 1 && timeToDi > 0) {
                    train.status = 'DEPARTING';
                    train.position = 70;
                    newEvents.push({
                        time: newTime,
                        type: 'TRAIN',
                        trainId: train.maChuyenTau,
                        message: `Tàu ${train.maChuyenTau} chuẩn bị xuất phát`,
                        severity: 'info'
                    });
                }

                if (train.status === 'DEPARTING' && timeToDi <= 0) {
                    train.status = 'DEPARTED';
                    train.gioDiThucTe = newTime;
                    train.position = 100;
                    newEvents.push({
                        time: newTime,
                        type: 'DEPARTURE',
                        trainId: train.maChuyenTau,
                        message: `Tàu ${train.maChuyenTau} đã rời ga`,
                        severity: 'success'
                    });
                }

                // Update position for animation
                if (train.status === 'APPROACHING') {
                    train.position = Math.min(50, 10 + (10 - timeToDen) * 4);
                }
            });

            // Add new events
            if (newEvents.length > 0) {
                setEvents(prev => [...newEvents, ...prev].slice(0, 50)); // Keep last 50 events
            }

            return newStates;
        });
    }, [currentTime]);

    // Simulation loop
    useEffect(() => {
        if (isPlaying && currentTime) {
            intervalRef.current = setInterval(() => {
                updateSimulation();
            }, 1000 / speed); // Adjust interval based on speed
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, speed, currentTime, updateSimulation]);

    // Control functions
    const play = useCallback(() => setIsPlaying(true), []);
    const pause = useCallback(() => setIsPlaying(false), []);
    const reset = useCallback(() => {
        setIsPlaying(false);
        initializeSimulation();
    }, [initializeSimulation]);

    const setSimulationSpeed = useCallback((newSpeed) => {
        setSpeed(newSpeed);
    }, []);

    // Statistics
    const stats = {
        total: trainStates.length,
        waiting: trainStates.filter(t => t.status === 'WAITING').length,
        approaching: trainStates.filter(t => t.status === 'APPROACHING').length,
        arrived: trainStates.filter(t => t.status === 'ARRIVED').length,
        departed: trainStates.filter(t => t.status === 'DEPARTED').length,
        delayed: trainStates.filter(t => t.soPhutTre > 0).length
    };

    return {
        isPlaying,
        speed,
        currentTime,
        trainStates,
        events,
        stats,
        play,
        pause,
        reset,
        setSpeed: setSimulationSpeed,
        initialize: initializeSimulation
    };
}
