import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  lastName: string;
}

export function WelcomeTemplate({ firstName, lastName }: EmailTemplateProps) {
  const name =
    firstName && lastName ? `${firstName} ${lastName}` : firstName || 'there';

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        padding: '20px',
      }}
    >
      {/* Header with gradient-like effect using background colors */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          padding: '30px 20px',
          textAlign: 'center',
          borderTop: '4px solid #3b82f6',
          borderRadius: '8px 8px 0 0',
        }}
      >
        <h1
          style={{
            color: '#1e293b',
            fontSize: '28px',
            margin: '0 0 10px 0',
            fontWeight: 'bold',
          }}
        >
          🎉 Welcome to Jobble, {name}!
        </h1>
        <p
          style={{
            color: '#64748b',
            fontSize: '16px',
            margin: '0',
            fontStyle: 'italic',
          }}
        >
          Your job search journey starts here
        </p>
      </div>

      {/* Main content */}
      <div
        style={{
          padding: '30px 20px',
          backgroundColor: '#ffffff',
          lineHeight: '1.6',
        }}
      >
        <p
          style={{
            color: '#334155',
            fontSize: '16px',
            margin: '0 0 20px 0',
          }}
        >
          We're thrilled to have you join our community of job seekers! 🚀
        </p>

        <div
          style={{
            backgroundColor: '#f1f5f9',
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #3b82f6',
          }}
        >
          <h2
            style={{
              color: '#1e293b',
              fontSize: '20px',
              margin: '0 0 15px 0',
              fontWeight: 'bold',
            }}
          >
            ✨ What you can do with Jobble:
          </h2>
          <ul
            style={{
              color: '#475569',
              fontSize: '15px',
              margin: '0',
              paddingLeft: '20px',
            }}
          >
            <li style={{ marginBottom: '8px' }}>
              📝 Track all your job applications in one place
            </li>
            <li style={{ marginBottom: '8px' }}>
              ⏰ Set reminders for follow-ups and interviews
            </li>
            <li style={{ marginBottom: '8px' }}>
              📊 Visualize your job search progress
            </li>
            <li style={{ marginBottom: '8px' }}>
              💼 Organize companies and contacts
            </li>
            <li style={{ marginBottom: '8px' }}>
              📈 Stay motivated with your application flow
            </li>
          </ul>
        </div>

        <p
          style={{
            color: '#334155',
            fontSize: '16px',
            margin: '20px 0',
          }}
        >
          Ready to get started? Simply log in to your account and add your first
          job application. We've made it super easy to get organized! 🎯
        </p>

        {/* CTA Button */}
        <div
          style={{
            textAlign: 'center',
            margin: '30px 0',
          }}
        >
          <a
            href="https://jobble.app/sign-in"
            style={{
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              padding: '12px 30px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'inline-block',
              border: 'none',
            }}
          >
            🚀 Get Started Now
          </a>
        </div>

        <p
          style={{
            color: '#64748b',
            fontSize: '14px',
            margin: '20px 0',
            fontStyle: 'italic',
          }}
        >
          💡 Pro tip: The more applications you track, the better insights
          you'll get about your job search patterns.
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          padding: '20px',
          textAlign: 'center',
          borderTop: '1px solid #e2e8f0',
          borderRadius: '0 0 8px 8px',
        }}
      >
        <p
          style={{
            color: '#64748b',
            fontSize: '14px',
            margin: '0 0 10px 0',
          }}
        >
          Need help? We're here for you! 💬
        </p>
        <p
          style={{
            color: '#64748b',
            fontSize: '14px',
            margin: '0 0 15px 0',
          }}
        >
          Contact us at{' '}
          <a
            href="mailto:support@westmorelandcreative.com"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
            }}
          >
            support@westmorelandcreative.com
          </a>
        </p>
        <p
          style={{
            color: '#94a3b8',
            fontSize: '12px',
            margin: '0',
          }}
        >
          Best regards,
          <br />
          <strong>Richard & the Jobble Team</strong> 👋
        </p>
      </div>
    </div>
  );
}
