import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSchool } from '../../contexts/SchoolContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { ArrowLeft, Plus, School } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageTerms() {
  const navigate = useNavigate();
  const { terms, addTerm } = useSchool();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTerm({
      name: formData.name,
      year: formData.year,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isCurrent: formData.isCurrent,
    });
    toast.success('Term added successfully!');
    setDialogOpen(false);
    setFormData({ name: '', year: '', startDate: '', endDate: '', isCurrent: false });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="size-5" />
          </Button>
          <School className="size-8 text-primary" />
          <h1 className="text-xl">Manage Terms</h1>
        </div>
      </header>

      <main className="container py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Academic Terms</CardTitle>
                <CardDescription>Manage academic terms and years</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="size-4 mr-2" />
                    Add Term
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Term</DialogTitle>
                    <DialogDescription>Create a new academic term</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Term Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., First Term"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="year">Academic Year</Label>
                      <Input
                        id="year"
                        placeholder="e.g., 2025-2026"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isCurrent"
                        checked={formData.isCurrent}
                        onCheckedChange={(checked) => setFormData({ ...formData, isCurrent: checked })}
                      />
                      <Label htmlFor="isCurrent">Set as current term</Label>
                    </div>
                    <Button type="submit" className="w-full">Add Term</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Term Name</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {terms.map((term) => (
                  <TableRow key={term.id}>
                    <TableCell>{term.name}</TableCell>
                    <TableCell>{term.year}</TableCell>
                    <TableCell>{term.startDate}</TableCell>
                    <TableCell>{term.endDate}</TableCell>
                    <TableCell>
                      {term.isCurrent ? (
                        <Badge>Current</Badge>
                      ) : (
                        <Badge variant="outline">Past</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
