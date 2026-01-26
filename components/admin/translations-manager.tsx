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

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ko', name: 'Korean' },
];

export default function TranslationsManager() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [filteredTranslations, setFilteredTranslations] = useState<Translation[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ key: '', value: '' });

  // Fetch translations
  useEffect(() => {
    fetchTranslations();
  }, [selectedLanguage]);

  // Filter translations
  useEffect(() => {
    const filtered = translations.filter(
      (t) =>
        t.language === selectedLanguage &&
        (t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.value.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredTranslations(filtered);
  }, [translations, selectedLanguage, searchTerm]);

  const fetchTranslations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/translations?language=${selectedLanguage}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error('Error fetching translations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.key || !formData.value) {
      alert('Key and value are required');
      return;
    }

    try {
      const response = await fetch('/api/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: formData.key,
          language: selectedLanguage,
          value: formData.value,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      setFormData({ key: '', value: '' });
      setIsOpen(false);
      setEditingId(null);
      fetchTranslations();
    } catch (error) {
      console.error('Error saving translation:', error);
      alert('Failed to save translation');
    }
  };

  const handleEdit = (translation: Translation) => {
    setFormData({ key: translation.key, value: translation.value });
    setEditingId(translation.id);
    setIsOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/translations?id=${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      setDeleteId(null);
      fetchTranslations();
    } catch (error) {
      console.error('Error deleting translation:', error);
      alert('Failed to delete translation');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredTranslations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translations-${selectedLanguage}.json`;
    link.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      for (const item of data) {
        await fetch('/api/translations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: item.key,
            language: selectedLanguage,
            value: item.value,
          }),
        });
      }

      fetchTranslations();
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
            Manage frontend translations across different languages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search translations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setFormData({ key: '', value: '' });
                      setEditingId(null);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Translation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? 'Edit Translation' : 'Add Translation'}
                    </DialogTitle>
                    <DialogDescription>
                      Create or update a translation for {selectedLanguage}
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
                        disabled={!!editingId}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Translation Value</label>
                      <Textarea
                        placeholder="Enter the translated text"
                        value={formData.value}
                        onChange={(e) =>
                          setFormData({ ...formData, value: e.target.value })
                        }
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        {editingId ? 'Update' : 'Create'}
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Loading translations...
                    </TableCell>
                  </TableRow>
                ) : filteredTranslations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No translations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTranslations.map((translation) => (
                    <TableRow key={translation.id}>
                      <TableCell className="font-medium">{translation.key}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {translation.value}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(translation.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(translation)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(translation.id)}
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
          <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Translation</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this translation? This action cannot be undone.
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {LANGUAGES.map((lang) => {
              const count = translations.filter(
                (t) => t.language === lang.code
              ).length;
              return (
                <div
                  key={lang.code}
                  className="p-4 border rounded-lg text-center"
                >
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-gray-600">{lang.name}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
