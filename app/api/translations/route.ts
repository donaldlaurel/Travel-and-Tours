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
      .select('*')
      .eq('language', language);

    if (key) {
      query = query.eq('key', key);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching translations:', error);
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

    const { key, language, value } = body;

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
        .insert([{ key, language, value }])
        .select();
    }

    const { data, error } = response;

    if (error) throw error;

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error saving translation:', error);
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
