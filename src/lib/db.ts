import { supabase } from '@/lib/supabase';
import { Profile, User, Post, ChatMessage, Vote, Rank, Comment } from '@/types/profile';
import crypto from 'crypto';

// Helper to map snake_case DB fields to camelCase TS interfaces
const mapProfile = (row: any): Profile => ({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    nickname: row.nickname,
    avatar: row.avatar,
    bio: row.bio,
    skills: row.skills || [],
    funFacts: row.fun_facts || [],
    catchphrase: row.catchphrase,
    mood: row.mood,
    level: row.level,
    xp: row.xp,
    votes: row.votes,
    rank: row.rank as Rank,
    achievements: row.achievements || [],
    socialLinks: row.social_links || [],
    galleryImages: row.gallery_images || [],
    theme: row.theme,
    createdAt: row.created_at,
    updatedAt: row.updated_at
});

const mapUser = (row: any): User => ({
    id: row.id,
    username: row.username,
    password: row.password,
    displayName: row.display_name,
    avatar: row.avatar,
    profileId: row.profile_id,
    createdAt: row.created_at
});

const mapPost = (row: any): Post => ({
    id: row.id,
    userId: row.user_id,
    authorName: row.author_name,
    authorAvatar: row.author_avatar,
    content: row.content,
    type: row.type,
    targetProfileId: row.target_profile_id,
    images: row.images || [],
    likes: row.likes,
    likedBy: row.liked_by || [],
    comments: [], // Comments are fetched separately or joined if needed, for now empty or we fetch them
    isPinned: row.is_pinned,
    createdAt: row.created_at
});

const mapVote = (row: any): Vote => ({
    id: row.id,
    profileId: row.profile_id,
    userId: row.user_id,
    createdAt: row.created_at
});

const mapChatMessage = (row: any): ChatMessage => ({
    id: row.id,
    roomId: row.room_id,
    userId: row.user_id,
    profileId: row.profile_id,
    senderName: row.sender_name,
    senderAvatar: row.sender_avatar,
    message: row.message,
    replyTo: row.reply_to,
    isPinned: row.is_pinned,
    createdAt: row.created_at
});

// ============= PROFILES =============
export async function getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
        console.error('Error fetching profiles:', error);
        return [];
    }
    return data.map(mapProfile);
}

export async function getProfileById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error || !data) return null;
    return mapProfile(data);
}

export async function createProfile(profile: Profile): Promise<Profile | null> {
    const row = {
        id: profile.id,
        user_id: profile.userId,
        name: profile.name,
        nickname: profile.nickname,
        avatar: profile.avatar,
        bio: profile.bio,
        skills: profile.skills,
        fun_facts: profile.funFacts,
        catchphrase: profile.catchphrase,
        mood: profile.mood,
        level: profile.level,
        xp: profile.xp,
        votes: profile.votes,
        rank: profile.rank,
        achievements: profile.achievements,
        social_links: profile.socialLinks,
        gallery_images: profile.galleryImages,
        theme: profile.theme,
        created_at: profile.createdAt || new Date().toISOString(),
        updated_at: profile.updatedAt || new Date().toISOString()
    };

    const { data, error } = await supabase.from('profiles').insert(row).select().single();
    if (error) {
        console.error('Error creating profile:', error);
        return null;
    }
    return mapProfile(data);
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
    const rowUpdates: any = { ...updates, updated_at: new Date().toISOString() };

    if (updates.userId) rowUpdates.user_id = updates.userId;
    if (updates.funFacts) rowUpdates.fun_facts = updates.funFacts;
    if (updates.socialLinks) rowUpdates.social_links = updates.socialLinks;
    if (updates.galleryImages) rowUpdates.gallery_images = updates.galleryImages;

    delete rowUpdates.userId;
    delete rowUpdates.funFacts;
    delete rowUpdates.socialLinks;
    delete rowUpdates.galleryImages;
    delete rowUpdates.createdAt;

    const { data, error } = await supabase
        .from('profiles')
        .update(rowUpdates)
        .eq('id', id)
        .select()
        .single();

    if (error) return null;
    return mapProfile(data);
}

// DELETE profile
export async function deleteProfile(id: string): Promise<boolean> {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
        console.error('Error deleting profile:', error);
        return false;
    }

    // After deleting profile, unlink it from the user
    const { error: userError } = await supabase.from('users').update({ profile_id: null }).eq('profile_id', id);
    if (userError) {
        console.error('Error unlinking user from profile:', userError);
    }

    return true;
}

export async function getTopProfiles(limit: number = 10): Promise<Profile[]> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('votes', { ascending: false })
        .limit(limit);

    if (error) return [];
    return data.map(mapProfile);
}

// ============= USERS =============
export async function getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return [];
    return data.map(mapUser);
}

export async function getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) return null;
    return mapUser(data);
}

export async function getUserByUsername(username: string): Promise<User | null> {
    const { data, error } = await supabase.from('users').select('*').ilike('username', username).single();
    if (error) return null;
    return mapUser(data);
}

export async function createUser(user: User): Promise<User | null> {
    const row = {
        id: user.id,
        username: user.username,
        password: user.password,
        display_name: user.displayName,
        avatar: user.avatar,
        profile_id: user.profileId,
        created_at: user.createdAt || new Date().toISOString()
    };
    const { data, error } = await supabase.from('users').insert(row).select().single();
    if (error) {
        console.error('Create user error:', error);
        return null;
    }
    return mapUser(data);
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const rowUpdates: any = { ...updates };
    if (updates.displayName) rowUpdates.display_name = updates.displayName;
    if (updates.profileId) rowUpdates.profile_id = updates.profileId;
    delete rowUpdates.displayName;
    delete rowUpdates.profileId;

    const { data, error } = await supabase.from('users').update(rowUpdates).eq('id', id).select().single();
    if (error) return null;
    return mapUser(data);
}

// ============= POSTS =============
export async function getAllPosts(): Promise<Post[]> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) return [];

    const posts = data.map(mapPost);

    // Naively fetch comments for each post
    for (const post of posts) {
        const { data: comments } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', post.id)
            .order('created_at', { ascending: true });

        post.comments = comments ? comments.map((c: any) => ({
            id: c.id,
            postId: c.post_id,
            userId: c.user_id,
            authorName: c.author_name,
            authorAvatar: c.author_avatar,
            content: c.content,
            parentId: c.parent_id,
            replies: [],
            createdAt: c.created_at
        })) : [];
    }
    return posts;
}

export async function getPostById(id: string): Promise<Post | null> {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
    if (error) return null;

    const post = mapPost(data);
    const { data: comments } = await supabase.from('comments').select('*').eq('post_id', id);
    post.comments = comments ? comments.map((c: any) => ({
        id: c.id,
        postId: c.post_id,
        userId: c.user_id,
        authorName: c.author_name,
        authorAvatar: c.author_avatar,
        content: c.content,
        parentId: c.parent_id,
        replies: [],
        createdAt: c.created_at
    })) : [];

    return post;
}

export async function createPost(post: Post): Promise<Post | null> {
    const row = {
        id: post.id,
        user_id: post.userId,
        author_name: post.authorName,
        author_avatar: post.authorAvatar,
        content: post.content,
        type: post.type,
        target_profile_id: post.targetProfileId,
        images: post.images,
        likes: post.likes,
        liked_by: post.likedBy,
        is_pinned: post.isPinned,
        created_at: post.createdAt || new Date().toISOString()
    };
    const { data, error } = await supabase.from('posts').insert(row).select().single();
    if (error) return null;
    return mapPost(data);
}

export async function updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
    const rowUpdates: any = { ...updates };
    if (updates.authorName) rowUpdates.author_name = updates.authorName;
    if (updates.authorAvatar) rowUpdates.author_avatar = updates.authorAvatar;
    if (updates.targetProfileId) rowUpdates.target_profile_id = updates.targetProfileId;
    if (updates.likedBy) rowUpdates.liked_by = updates.likedBy;
    if (updates.isPinned) rowUpdates.is_pinned = updates.isPinned;

    delete rowUpdates.authorName;
    delete rowUpdates.authorAvatar;
    delete rowUpdates.targetProfileId;
    delete rowUpdates.likedBy;
    delete rowUpdates.isPinned;
    delete rowUpdates.comments;

    const { data, error } = await supabase.from('posts').update(rowUpdates).eq('id', id).select().single();
    if (error) return null;
    return mapPost(data);
}

export async function deletePost(id: string): Promise<boolean> {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    return !error;
}

export async function likePost(id: string): Promise<Post | null> {
    const post = await getPostById(id);
    if (!post) return null;

    const newLikes = (post.likes || 0) + 1;
    return updatePost(id, { likes: newLikes });
}

export async function addComment(comment: Comment): Promise<Comment | null> {
    const row = {
        id: comment.id,
        post_id: comment.postId,
        user_id: comment.userId,
        author_name: comment.authorName,
        author_avatar: comment.authorAvatar,
        content: comment.content,
        parent_id: comment.parentId,
        created_at: comment.createdAt || new Date().toISOString()
    };
    const { data, error } = await supabase.from('comments').insert(row).select().single();
    if (error) {
        console.error('Error adding comment:', error);
        return null;
    }
    return {
        id: data.id,
        postId: data.post_id,
        userId: data.user_id,
        authorName: data.author_name,
        authorAvatar: data.author_avatar,
        content: data.content,
        parentId: data.parent_id,
        createdAt: data.created_at
    };
}

// ============= CHAT =============
export async function getChatMessages(limit: number = 100): Promise<ChatMessage[]> {
    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) return [];
    return data.map(mapChatMessage).reverse();
}

export async function addChatMessage(message: ChatMessage): Promise<ChatMessage | null> {
    const row = {
        id: message.id,
        room_id: message.roomId,
        user_id: message.userId,
        profile_id: message.profileId,
        sender_name: message.senderName,
        sender_avatar: message.senderAvatar,
        message: message.message,
        reply_to: message.replyTo,
        is_pinned: message.isPinned,
        created_at: message.createdAt || new Date().toISOString()
    };
    const { data, error } = await supabase.from('chat_messages').insert(row).select().single();
    if (error) return null;
    return mapChatMessage(data);
}

// ============= VOTES =============
export async function getVotes(): Promise<Vote[]> {
    const { data, error } = await supabase.from('votes').select('*');
    if (error) return [];
    return data.map(mapVote);
}

export async function addVote(vote: Vote): Promise<Vote | null> {
    const row = {
        id: vote.id,
        profile_id: vote.profileId,
        user_id: vote.userId,
        created_at: vote.createdAt || new Date().toISOString()
    };
    const { data, error } = await supabase.from('votes').insert(row).select().single();
    if (error) return null;
    return mapVote(data);
}

export async function getVotesForProfile(profileId: string): Promise<number> {
    const { count, error } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId);

    if (error) return 0;
    return count || 0;
}

export async function hasVotedToday(userId: string, profileId: string): Promise<boolean> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayStr = todayStart.toISOString();

    const { count, error } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('profile_id', profileId)
        .gte('created_at', todayStr);

    return (count || 0) > 0;
}

export async function getTodayVoteCount(userId: string): Promise<number> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayStr = todayStart.toISOString();

    const { count, error } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', todayStr);

    return count || 0;
}

// ============= HELPERS =============
export function generateId(prefix: string = 'id'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
}

export function calculateRank(votes: number): Rank {
    if (votes >= 1000) return 'legend';
    if (votes >= 500) return 'master';
    if (votes >= 200) return 'diamond';
    if (votes >= 100) return 'platinum';
    if (votes >= 50) return 'gold';
    if (votes >= 20) return 'silver';
    return 'bronze';
}

export async function updateProfileVotesAndRank(profileId: string): Promise<Profile | null> {
    const votes = await getVotesForProfile(profileId);
    const rank = calculateRank(votes);
    return updateProfile(profileId, { votes, rank });
}
