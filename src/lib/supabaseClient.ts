import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import bcrypt from 'bcryptjs';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(supabaseUrl ?? '', supabaseAnonKey ?? '');

// Helper types for database operations
export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;

// Extended user type that includes the password field
interface UserWithPassword extends TableRow<'users'> {
  password: string;
}

// Type helper for getting Row, Insert, and Update types for any table
export type TableRow<T extends TableName> = Tables[T]['Row'];
export type TableInsert<T extends TableName> = Tables[T]['Insert'];
export type TableUpdate<T extends TableName> = Tables[T]['Update'];

// User management helpers
export const getUserByEmail = async (email: string): Promise<TableRow<'users'> | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // Row not found
    throw error;
  }
  return data;
};

export const createUser = async (userData: TableInsert<'users'>): Promise<TableRow<'users'>> => {
  // Use any-casts to satisfy Supabase client's TypeScript overloads in this workspace
  const table: any = (supabase.from('users') as any);
  const { data, error } = await table.insert(userData as any).select().single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create user');
  return data as TableRow<'users'>;
};

export const updateUserProfile = async (
  userId: number,
  updates: TableUpdate<'users'>
): Promise<TableRow<'users'>> => {
  const table: any = (supabase.from('users') as any);
  const query: any = table.update(updates as any);
  const { data, error } = await query.eq('id', userId).select().single();

  if (error) throw error;
  if (!data) throw new Error('Failed to update user');
  return data as TableRow<'users'>;
};

// New function to update user password
export const updateUserPassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<console.log> => {
  // First get the user to verify current password
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('password')
    .eq('id', userId)
    .single();

  if (userError) throw userError;
  if (!userData) throw new Error('User not found');

  const user = userData as UserWithPassword;

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) throw new Error('Current password is incorrect');

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password - using type casting to handle the password field
  const table: any = supabase.from('users');
  const { error: updateError } = await table
    .update({ password: hashedPassword } as any)
    .eq('id', userId);

  if (updateError) throw updateError;
};

// Content management helpers
export const getContentItems = async (categoryId?: number): Promise<TableRow<'content_items'>[]> => {
  let query = supabase.from('content_items').select(`
    *,
    category:content_categories(*),
    status:content_statuses(*),
    author:users(*)
  `);
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getDocuments = async (): Promise<TableRow<'documents'>[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      content:content_items(
        *,
        category:content_categories(*),
        status:content_statuses(*)
      ),
      document_type:document_types(*)
    `);
  
  if (error) throw error;
  return data || [];
};

export const getVideos = async (): Promise<TableRow<'videos'>[]> => {
  const { data, error } = await supabase
    .from('videos')
    .select(`
      *,
      content:content_items(
        *,
        category:content_categories(*),
        status:content_statuses(*)
      ),
      video_type:video_types(*)
    `);
  
  if (error) throw error;
  return data || [];
};

export const getReferenceData = async () => {
  const [categories, statuses, documentTypes, videoTypes] = await Promise.all([
    supabase.from('content_categories').select('*'),
    supabase.from('content_statuses').select('*'),
    supabase.from('document_types').select('*'),
    supabase.from('video_types').select('*')
  ]);

  if (categories.error) throw categories.error;
  if (statuses.error) throw statuses.error;
  if (documentTypes.error) throw documentTypes.error;
  if (videoTypes.error) throw videoTypes.error;

  return {
    categories: categories.data || [],
    statuses: statuses.data || [],
    documentTypes: documentTypes.data || [],
    videoTypes: videoTypes.data || []
  };
};

export default supabase;
