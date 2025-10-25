import { supabase } from './supabaseClient';

// Shared status type for all content - SIMPLIFIED 3-STATUS SYSTEM
export type ContentStatus = 'pending' | 'rejected' | 'verified'

export type DocumentCategory = {
  id: number;
  name: string;
  description: string;
};

export type Document = {
  id: number;
  title: string;
  description: string;
  file_url: string;
  category_id: number;
  user_id: number;
  status: ContentStatus;
  journal: string;
  year: number;
  created_at: string;
  category?: DocumentCategory;
  user?: {
    username: string;
    full_name: string;
  };
};

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('document_categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function fetchDocuments(filters: {
  status?: string | undefined;
  category_id?: number;
  search?: string;
  user_id?: number;
  showAll?: boolean;
}) {
  let query = supabase
    .from('documents')
    .select(`
      *,
      category:document_categories(*),
      user:users(username, full_name)
    `);

  if (filters.status) {
    query = query.eq('status', filters.status);
  } else if (!filters.showAll) {
    // Only show accepted documents to regular users by default
    query = query.eq('status', 'accepted');
  }
  // If showAll is true, show all documents regardless of status

  if (filters.category_id) {
    query = query.eq('category_id', filters.category_id);
  }

  if (filters.user_id) {
    query = query.eq('user_id', filters.user_id);
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createDocument(document: Omit<Document, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('documents')
    .insert(document as any)
    .select()
    .single();
  
  if (error) throw error;
  return data as Document;
}

export async function updateDocument(id: number, updates: Partial<Omit<Document, 'id' | 'created_at' | 'user_id'>>) {
  const { data, error } = await supabase
    .from('documents')
    // @ts-ignore - Supabase type issue
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Document;
}

export async function updateDocumentStatus(id: number, status: Document['status']) {
  const { data, error } = await supabase
    .from('documents')
    // @ts-ignore - Supabase type issue
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Document;
}

export async function deleteDocument(id: number) {
  // First, get the document to retrieve the file URL
  const { data: document, error: fetchError } = await supabase
    .from('documents')
    .select('file_url')
    .eq('id', id)
    .single();
  
  if (fetchError) throw fetchError;
  
  // Extract the file path from the URL
  const docData = document as any;
  if (docData && docData.file_url) {
    try {
      // Parse the file path from the URL
      // URL format: https://[project].supabase.co/storage/v1/object/public/T2T/uploads/filename
      const url = new URL(docData.file_url);
      const pathParts = url.pathname.split('/');
      // Find the part after 'T2T' which is our file path
      const bucketIndex = pathParts.indexOf('T2T');
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        const filePath = pathParts.slice(bucketIndex + 1).join('/');
        
        // Delete the file from storage
        const { error: storageError } = await supabase.storage
          .from('T2T')
          .remove([filePath]);
        
        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Continue with database deletion even if storage deletion fails
        }
      }
    } catch (urlError) {
      console.error('Error parsing file URL:', urlError);
      // Continue with database deletion even if URL parsing fails
    }
  }
  
  // Delete the document record from database
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}