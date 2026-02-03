'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Plus, Copy, CheckCircle, Link as LinkIcon, Gift
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  DialogTrigger,
} from '@/components/ui/dialog';

// Sample data - in production, fetch from API
const sampleReferrals = [
  { id: '1', code: 'MUMMYBLOGGER25', name: 'Sarah Johnson', type: 'Influencer', uses: 45, earnings: 89.55, status: 'active' },
  { id: '2', code: 'INSTA10', name: 'Emma Williams', type: 'Social', uses: 23, earnings: 45.77, status: 'active' },
  { id: '3', code: 'FAMILY2025', name: 'The Smith Family', type: 'Customer', uses: 8, earnings: 15.92, status: 'active' },
  { id: '4', code: 'YOUTUBE20', name: 'Baby Channel', type: 'Influencer', uses: 67, earnings: 133.33, status: 'active' },
  { id: '5', code: 'TIKTOK15', name: 'MomLife Tips', type: 'Influencer', uses: 34, earnings: 67.66, status: 'pending' },
];

export default function ReferralsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCodeName, setNewCodeName] = useState('');
  const [newCodeType, setNewCodeType] = useState('customer');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const totalEarnings = sampleReferrals.reduce((sum, r) => sum + r.earnings, 0);
  const totalUses = sampleReferrals.reduce((sum, r) => sum + r.uses, 0);
  const activeCodes = sampleReferrals.filter(r => r.status === 'active').length;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(`https://nubpredictor.com?ref=${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-bold">Referral Program</h1>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Referral Code</DialogTitle>
                  <DialogDescription>
                    Create a unique referral code for a customer or influencer.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="name">Name/Brand</Label>
                    <Input
                      id="name"
                      value={newCodeName}
                      onChange={(e) => setNewCodeName(e.target.value)}
                      placeholder="e.g., Sarah Johnson"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <select
                      id="type"
                      value={newCodeType}
                      onChange={(e) => setNewCodeType(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="customer">Customer</option>
                      <option value="influencer">Influencer</option>
                      <option value="social">Social Media</option>
                    </select>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Create Referral Code
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Referral Codes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{sampleReferrals.length}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Codes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{activeCodes}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Uses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{totalUses}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Commission</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">£{totalEarnings.toFixed(2)}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Referral Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Referral Codes</CardTitle>
            <CardDescription>Manage your referral partners and track performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uses</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>
                      <code className="bg-neutral-100 px-2 py-1 rounded text-sm font-mono">
                        {referral.code}
                      </code>
                    </TableCell>
                    <TableCell className="font-medium">{referral.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {referral.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{referral.uses}</TableCell>
                    <TableCell className="font-medium">£{referral.earnings.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={referral.status === 'active' ? 'default' : 'secondary'}>
                        {referral.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyCode(referral.code)}
                      >
                        {copiedCode === referral.code ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                <CardTitle>Commission Structure</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-neutral-600">Customer Referrals</span>
                  <span className="font-medium">£2.00 per sale</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-neutral-600">Social Media</span>
                  <span className="font-medium">£2.00 per sale</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-neutral-600">Influencers</span>
                  <span className="font-medium">Negotiable</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-primary" />
                <CardTitle>Quick Links</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-primary hover:underline">
                    View Landing Page →
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-primary hover:underline">
                    Back to Predictions →
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
