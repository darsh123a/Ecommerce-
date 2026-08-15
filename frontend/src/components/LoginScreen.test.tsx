import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { LoginScreen } from './LoginScreen';

describe('LoginScreen Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders login form with Lyzo branding and input fields', () => {
    render(<LoginScreen />);
    
    expect(screen.getByText('Lyzo')).toBeDefined();
    expect(screen.getByText('Sign in to Lyzo')).toBeDefined();
    expect(screen.getByLabelText(/Email Address/i)).toBeDefined();
    expect(screen.getByLabelText(/Password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeDefined();
  });

  it('displays validation errors on empty submission', async () => {
    render(<LoginScreen />);
    
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email address is required')).toBeDefined();
      expect(screen.getByText('Password is required')).toBeDefined();
    });
  });

  it('displays validation error for invalid email format', async () => {
    render(<LoginScreen />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeDefined();
    });
  });
});
