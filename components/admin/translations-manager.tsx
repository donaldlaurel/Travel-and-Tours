'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2, Download, Upload } from 'lucide-react';

interface Translation {
  id: string;
  key: string;
  language: string;
  value: string;
  created_at: string;
  updated_at: string;
}

interface TranslationPair {
  key: string;
  en: string;
  ko: string;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ko', name: 'Korean' },
];

export default function TranslationsManager() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [pairedTranslations, setPairedTranslations] = useState<TranslationPair[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [formData, setFormData] = useState({ key: '', en: '', ko: '' });

  // Fetch all translations
  useEffect(() => {
    fetchAllTranslations();
  }, []);

  // Pair translations by key
  useEffect(() => {
    const pairs: { [key: string]: TranslationPair } = {};

    translations.forEach((t) => {
      if (!pairs[t.key]) {
        pairs[t.key] = { key: t.key, en: '', ko: '' };
      }
      pairs[t.key][t.language as 'en' | 'ko'] = t.value;
    });

    const paired = Object.values(pairs).filter(
      (p) =>
        p.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ko.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setPairedTranslations(paired);
  }, [translations, searchTerm]);

  const fetchAllTranslations = async () => {
    try {
      setIsLoading(true);
      // Fetch both languages
      const enResponse = await fetch('/api/translations?language=en');
      const koResponse = await fetch('/api/translations?language=ko');

      if (!enResponse.ok || !koResponse.ok) {
        console.error('[v0] Failed to fetch translations:', enResponse.status, koResponse.status);
        throw new Error('Failed to fetch');
      }

      const enData = await enResponse.json();
      const koData = await koResponse.json();

      console.log('[v0] Fetched EN translations:', enData.length);
      console.log('[v0] Fetched KO translations:', koData.length);

      setTranslations([...enData, ...koData]);
    } catch (error) {
      console.error('[v0] Error fetching translations:', error);
      alert('Failed to load translations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.key || (!formData.en && !formData.ko)) {
      alert('Key and at least one translation value are required');
      return;
    }

    try {
      // Save English translation
      if (formData.en) {
        await fetch('/api/translations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: formData.key,
            language: 'en',
            value: formData.en,
          }),
        });
      }

      // Save Korean translation
      if (formData.ko) {
        await fetch('/api/translations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: formData.key,
            language: 'ko',
            value: formData.ko,
          }),
        });
      }

      setFormData({ key: '', en: '', ko: '' });
      setIsOpen(false);
      setEditingKey(null);
      fetchAllTranslations();
    } catch (error) {
      console.error('Error saving translation:', error);
      alert('Failed to save translation');
    }
  };

  const handleEdit = (pair: TranslationPair) => {
    setFormData({ key: pair.key, en: pair.en, ko: pair.ko });
    setEditingKey(pair.key);
    setIsOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteKey) return;

    try {
      // Find all translations with this key
      const toDelete = translations.filter((t) => t.key === deleteKey);

      // Delete each one
      for (const t of toDelete) {
        await fetch(`/api/translations?id=${t.id}`, {
          method: 'DELETE',
        });
      }

      setDeleteKey(null);
      fetchAllTranslations();
    } catch (error) {
      console.error('Error deleting translation:', error);
      alert('Failed to delete translation');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(pairedTranslations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translations-all.json`;
    link.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      for (const item of data) {
        if (item.en) {
          await fetch('/api/translations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              key: item.key,
              language: 'en',
              value: item.en,
            }),
          });
        }

        if (item.ko) {
          await fetch('/api/translations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              key: item.key,
              language: 'ko',
              value: item.ko,
            }),
          });
        }
      }

      fetchAllTranslations();
      alert('Translations imported successfully');
    } catch (error) {
      console.error('Error importing translations:', error);
      alert('Failed to import translations');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Translation Management</CardTitle>
          <CardDescription>
            Manage English and Korean translations together
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search by key or translation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setFormData({ key: '', en: '', ko: '' });
                      setEditingKey(null);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Translation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingKey ? 'Edit Translation' : 'Add Translation'}
                    </DialogTitle>
                    <DialogDescription>
                      Create or update translations for both English and Korean
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Translation Key</label>
                      <Input
                        placeholder="e.g., header.title"
                        value={formData.key}
                        onChange={(e) =>
                          setFormData({ ...formData, key: e.target.value })
                        }
                        disabled={!!editingKey}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">English</label>
                        <Textarea
                          placeholder="Enter English text"
                          value={formData.en}
                          onChange={(e) =>
                            setFormData({ ...formData, en: e.target.value })
                          }
                          rows={4}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Korean (한국어)</label>
                        <Textarea
                          placeholder="한국어 텍스트 입력"
                          value={formData.ko}
                          onChange={(e) =>
                            setFormData({ ...formData, ko: e.target.value })
                          }
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        {editingKey ? 'Update' : 'Create'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="icon"
                onClick={handleExport}
                title="Export translations"
              >
                <Download className="h-4 w-4" />
              </Button>

              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  id="import-file"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => document.getElementById('import-file')?.click()}
                  title="Import translations"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Translations Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>English</TableHead>
                  <TableHead>Korean</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Loading translations...
                    </TableCell>
                  </TableRow>
                ) : pairedTranslations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No translations found
                    </TableCell>
                  </TableRow>
                ) : (
                  pairedTranslations.map((pair) => (
                    <TableRow key={pair.key}>
                      <TableCell className="font-medium">{pair.key}</TableCell>
                      <TableCell className="max-w-xs truncate text-gray-700">
                        {pair.en || '—'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-gray-700">
                        {pair.ko || '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(pair)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteKey(pair.key)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Delete Confirmation */}
          <AlertDialog open={!!deleteKey} onOpenChange={() => setDeleteKey(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Translation</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the translation for key "{deleteKey}"? This will remove both English and Korean versions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex justify-end gap-2">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600">
                  Delete
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Translation Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">{pairedTranslations.length}</div>
              <div className="text-sm text-gray-600">Total Keys</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">
                {pairedTranslations.filter((p) => p.en).length}
              </div>
              <div className="text-sm text-gray-600">English</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">
                {pairedTranslations.filter((p) => p.ko).length}
              </div>
              <div className="text-sm text-gray-600">Korean</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
