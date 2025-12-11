'use client';

import { useState, useEffect } from 'react';

export function useVisitor() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [remainingVotes, setRemainingVotes] = useState<number>(0);

    useEffect(() => {
        // Fetch remaining votes (requires login)
        fetchRemainingVotes();
    }, []);

    const fetchRemainingVotes = async () => {
        try {
            const res = await fetch('/api/votes');
            if (res.ok) {
                const data = await res.json();
                setIsLoggedIn(data.isLoggedIn);
                setRemainingVotes(data.remainingVotes);
            }
        } catch (error) {
            console.error('Error fetching votes:', error);
        }
    };

    const vote = async (profileId: string): Promise<{ success: boolean; error?: string; remainingVotes?: number }> => {
        try {
            const res = await fetch('/api/votes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileId }),
            });

            const data = await res.json();

            if (res.ok) {
                setRemainingVotes(data.remainingVotes);
                return { success: true, remainingVotes: data.remainingVotes };
            } else {
                if (data.remainingVotes !== undefined) {
                    setRemainingVotes(data.remainingVotes);
                }
                return { success: false, error: data.error, remainingVotes: data.remainingVotes };
            }
        } catch (error) {
            return { success: false, error: 'Ủng hộ thất bại' };
        }
    };

    const refreshVotes = () => {
        fetchRemainingVotes();
    };

    return { isLoggedIn, remainingVotes, vote, refreshVotes };
}
