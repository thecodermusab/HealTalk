import { NextResponse } from 'next/server';
import { EmailService } from '@/lib/email/service';

// Test route to verify email sending works
// Usage: http://localhost:3000/api/test/email?to=your@email.com&type=welcome

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const to = searchParams.get('to');
    const type = searchParams.get('type') || 'welcome';

    if (!to) {
      return NextResponse.json(
        { error: 'Email address required. Use ?to=your@email.com' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'welcome':
        result = await EmailService.sendWelcomePatient(to, 'Test User');
        break;

      case 'welcome-psychologist':
        result = await EmailService.sendWelcomePsychologist(to, 'Test Doctor');
        break;

      case 'approved':
        result = await EmailService.sendPsychologistApproved(to, 'Test Doctor');
        break;

      case 'appointment':
        result = await EmailService.sendAppointmentConfirmation(to, {
          patientName: 'Test Patient',
          psychologistName: 'Dr. Test',
          date: 'Monday, February 10, 2026',
          time: '2:30 PM',
          duration: 60,
          price: '$75.00',
          appointmentId: 'test-123',
        });
        break;

      case 'reminder-24h':
        result = await EmailService.send24hReminder(to, {
          patientName: 'Test Patient',
          psychologistName: 'Dr. Test',
          date: 'Tomorrow, February 7, 2026',
          time: '2:30 PM',
          appointmentId: 'test-123',
        });
        break;

      case 'reminder-1h':
        result = await EmailService.send1hReminder(to, {
          patientName: 'Test Patient',
          psychologistName: 'Dr. Test',
          time: '2:30 PM',
          appointmentId: 'test-123',
        });
        break;

      case 'password-reset':
        result = await EmailService.sendPasswordReset(to, 'Test User', 'test-token-123');
        break;

      default:
        return NextResponse.json(
          {
            error: 'Invalid email type',
            available: [
              'welcome',
              'welcome-psychologist',
              'approved',
              'appointment',
              'reminder-24h',
              'reminder-1h',
              'password-reset'
            ]
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `${type} email sent to ${to}`,
      result,
    });

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
