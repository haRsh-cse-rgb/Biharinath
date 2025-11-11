"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'OTP Sent',
          description: data.message || 'OTP has been sent to your email.',
        });
        setStep('otp');
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to send OTP',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok && data.verified) {
        toast({
          title: 'OTP Verified',
          description: 'OTP verified successfully. Please enter your new password.',
        });
        setStep('reset');
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Invalid OTP',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Password reset successfully. Please login with your new password.',
        });
        router.push('/auth/login');
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to reset password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {step === 'email' && 'Forgot Password'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'reset' && 'Reset Password'}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 'email' && 'Enter your email to receive an OTP'}
            {step === 'otp' && 'Enter the OTP sent to your email'}
            {step === 'reset' && 'Enter your new password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  className="text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-gray-500 text-center">
                  Check your email for the OTP code
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep('email')}
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>
        <div className="px-6 pb-6">
          <Link href="/auth/login" className="text-sm text-center text-gray-600 block hover:text-green-600">
            ← Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
}

