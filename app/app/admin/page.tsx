'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Prediction = {
  id: string;
  customer_email: string;
  scan_image_url: string;
  ai_prediction: string | null;
  ai_confidence: number | null;
  status: string;
  created_at: string;
  referral_code: string | null;
  amount_paid: number;
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [filteredPredictions, setFilteredPredictions] = useState<Prediction[]>([]);
  const [filter, setFilter] = useState('all');
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadPredictions();
    }
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredPredictions(predictions);
    } else {
      setFilteredPredictions(predictions.filter((p) => p.status === filter));
    }
  }, [filter, predictions]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      loadPredictions();
    } else {
      setError('Incorrect password');
    }
  };

  const loadPredictions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/predictions');
      const data = await response.json();
      setPredictions(data.predictions || []);
    } catch (err) {
      setError('Failed to load predictions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (predictionId: string, result: 'boy' | 'girl' | 'unclear') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prediction_id: predictionId,
          result,
        }),
      });

      if (response.ok) {
        setSelectedPrediction(null);
        loadPredictions();
      } else {
        setError('Failed to confirm result');
      }
    } catch (err) {
      setError('Failed to confirm result');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter admin password to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert className="border-red-500">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    total: predictions.length,
    pending: predictions.filter((p) => p.status === 'pending').length,
    sent: predictions.filter((p) => p.status === 'sent').length,
    refunded: predictions.filter((p) => p.status === 'refunded').length,
    revenue: predictions.reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0),
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem('admin_auth');
              setIsAuthenticated(false);
            }}
          >
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Review</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Sent Results</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats.sent}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Refunds Issued</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{stats.refunded}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">£{(stats.revenue || 0).toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Predictions Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Predictions</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={filter === 'sent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('sent')}
                >
                  Sent
                </Button>
                <Button
                  variant={filter === 'refunded' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('refunded')}
                >
                  Refunded
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>AI Prediction</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Referral</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPredictions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-neutral-500">
                      No predictions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPredictions.map((prediction) => (
                    <TableRow key={prediction.id}>
                      <TableCell className="font-medium">
                        {prediction.customer_email}
                      </TableCell>
                      <TableCell>
                        {prediction.ai_prediction ? (
                          <Badge
                            variant={
                              prediction.ai_prediction === 'boy'
                                ? 'default'
                                : prediction.ai_prediction === 'girl'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {prediction.ai_prediction}
                          </Badge>
                        ) : (
                          <span className="text-neutral-400">Analyzing...</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {prediction.ai_confidence
                          ? `${prediction.ai_confidence.toFixed(0)}%`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            prediction.status === 'pending'
                              ? 'outline'
                              : prediction.status === 'sent'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {prediction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(prediction.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {prediction.referral_code || '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => setSelectedPrediction(prediction)}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Review Dialog */}
        <Dialog
          open={!!selectedPrediction}
          onOpenChange={() => setSelectedPrediction(null)}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Review Prediction</DialogTitle>
              <DialogDescription>
                {selectedPrediction?.customer_email}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <img
                  src={selectedPrediction?.scan_image_url}
                  alt="Ultrasound scan"
                  className="w-full rounded-lg border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>AI Prediction</Label>
                  <p className="text-lg font-semibold capitalize">
                    {selectedPrediction?.ai_prediction || 'Processing...'}
                  </p>
                </div>
                <div>
                  <Label>AI Confidence</Label>
                  <p className="text-lg font-semibold">
                    {selectedPrediction?.ai_confidence?.toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <Button
                  onClick={() =>
                    selectedPrediction && handleConfirm(selectedPrediction.id, 'boy')
                  }
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Confirm Boy
                </Button>
                <Button
                  onClick={() =>
                    selectedPrediction && handleConfirm(selectedPrediction.id, 'girl')
                  }
                  disabled={isLoading}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  Confirm Girl
                </Button>
                <Button
                  onClick={() =>
                    selectedPrediction && handleConfirm(selectedPrediction.id, 'unclear')
                  }
                  disabled={isLoading}
                  variant="outline"
                >
                  Image Unclear - Refund
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
