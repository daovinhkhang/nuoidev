import { NextRequest, NextResponse } from 'next/server';
import {
    addVote,
    hasVotedToday,
    getTodayVoteCount,
    generateId,
    updateProfileVotesAndRank,
    getProfileById,
    getUserById
} from '@/lib/db';
import { Vote, UserSession } from '@/types/profile';
import { MAX_VOTES_PER_DAY } from '@/lib/utils';

export const dynamic = 'force-dynamic';

// POST - Vote for a profile (only logged-in users)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { profileId } = body;

        if (!profileId) {
            return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
        }

        // Get session cookie
        const sessionCookie = request.cookies.get('session');
        if (!sessionCookie?.value) {
            return NextResponse.json({ 
                error: 'Vui lòng đăng nhập để ủng hộ' 
            }, { status: 401 });
        }

        const session: UserSession = JSON.parse(sessionCookie.value);
        if (!session.userId) {
            return NextResponse.json({ 
                error: 'Vui lòng đăng nhập để ủng hộ' 
            }, { status: 401 });
        }

        // Cannot vote for yourself
        const profile = await getProfileById(profileId);
        if (!profile) {
            return NextResponse.json({ error: 'Không tìm thấy hồ sơ' }, { status: 404 });
        }

        if (profile.userId === session.userId) {
            return NextResponse.json({ 
                error: 'Bạn không thể ủng hộ chính mình!' 
            }, { status: 400 });
        }

        // Check daily vote limit
        const todayVotes = await getTodayVoteCount(session.userId);
        if (todayVotes >= MAX_VOTES_PER_DAY) {
            return NextResponse.json({
                error: `Bạn đã hết lượt vote hôm nay (${MAX_VOTES_PER_DAY} lượt/ngày)`,
                remainingVotes: 0
            }, { status: 429 });
        }

        // Check if already voted for this profile today
        if (await hasVotedToday(session.userId, profileId)) {
            return NextResponse.json({
                error: 'Bạn đã ủng hộ người này hôm nay rồi! Quay lại mai nhé~',
                remainingVotes: MAX_VOTES_PER_DAY - todayVotes
            }, { status: 429 });
        }

        // Create vote
        const vote: Vote = {
            id: generateId('vote'),
            profileId,
            userId: session.userId,
            createdAt: new Date().toISOString(),
        };

        await addVote(vote);

        // Update profile votes and rank
        const updatedProfile = await updateProfileVotesAndRank(profileId);

        return NextResponse.json({
            message: 'Ủng hộ thành công!',
            profile: updatedProfile,
            remainingVotes: MAX_VOTES_PER_DAY - todayVotes - 1,
        });
    } catch (error) {
        console.error('Vote error:', error);
        return NextResponse.json({ error: 'Ủng hộ thất bại' }, { status: 500 });
    }
}

// GET - Get remaining votes for current user
export async function GET(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get('session');
        
        // If not logged in, return 0 remaining votes
        if (!sessionCookie?.value) {
            return NextResponse.json({ 
                remainingVotes: 0,
                todayVotes: 0,
                isLoggedIn: false
            });
        }

        const session: UserSession = JSON.parse(sessionCookie.value);
        if (!session.userId) {
            return NextResponse.json({ 
                remainingVotes: 0,
                todayVotes: 0,
                isLoggedIn: false
            });
        }

        const todayVotes = await getTodayVoteCount(session.userId);
        return NextResponse.json({
            remainingVotes: Math.max(0, MAX_VOTES_PER_DAY - todayVotes),
            todayVotes,
            isLoggedIn: true
        });
    } catch (error) {
        console.error('Get votes error:', error);
        return NextResponse.json({ 
            remainingVotes: 0,
            todayVotes: 0,
            isLoggedIn: false
        });
    }
}
