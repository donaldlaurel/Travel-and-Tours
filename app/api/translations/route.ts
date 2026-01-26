import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'en';
    const key = searchParams.get('key');

    let query = supabase
      .from('translations')
      .select('key, value, language')
      .eq('language', language);

    if (key) {
      query = query.eq('key', key);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[v0] Error fetching translations:', error);
      throw error;
    }

    console.log('[v0] Translations fetched successfully for language:', language, 'Count:', data?.length || 0);
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('[v0] Error fetching translations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch translations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { key, language, value, category } = body;

    if (!key || !language || !value) {
      return NextResponse.json(
        { error: 'Key, language, and value are required' },
        { status: 400 }
      );
    }

    // Extract category from key (e.g., "home.title" -> "home")
    const extractedCategory = category || key.split('.')[0] || 'general';

    // Check if translation already exists
    const { data: existing } = await supabase
      .from('translations')
      .select('id')
      .eq('key', key)
      .eq('language', language)
      .single();

    let response;

    if (existing) {
      // Update existing translation
      response = await supabase
        .from('translations')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select();
    } else {
      // Insert new translation
      response = await supabase
        .from('translations')
        .insert([{ key, language, value, category: extractedCategory }])
        .select();
    }

    const { data, error } = response;

    if (error) {
      console.error('[v0] Error saving translation:', error);
      throw error;
    }

    console.log('[v0] Translation saved successfully:', key, language);
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('[v0] Error saving translation:', error);
    return NextResponse.json(
      { error: 'Failed to save translation' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Translation ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('translations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting translation:', error);
    return NextResponse.json(
      { error: 'Failed to delete translation' },
      { status: 500 }
    );
  }
}
