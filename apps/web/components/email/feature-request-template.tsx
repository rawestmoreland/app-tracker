import { FeatureRequest } from '@prisma/client';

export function FeatureRequestTemplate({
  featureRequest,
}: {
  featureRequest: FeatureRequest;
}) {
  return (
    <div>
      <h1>Feature Request</h1>
      <p>{featureRequest.description}</p>
    </div>
  );
}

export function FeatureRequestThankYouTemplate({
  featureRequest,
}: {
  featureRequest: FeatureRequest;
}) {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        color: '#333333',
        lineHeight: '1.6',
      }}
    >
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '40px 30px',
          textAlign: 'center' as const,
          borderBottom: '3px solid #007bff',
        }}
      >
        <h1
          style={{
            color: '#007bff',
            fontSize: '28px',
            margin: '0 0 10px 0',
            fontWeight: 'bold',
          }}
        >
          Thank You! 🎉
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#666666',
            margin: '0',
          }}
        >
          Your feature request has been received
        </p>
      </div>

      <div style={{ padding: '30px' }}>
        <p
          style={{
            fontSize: '18px',
            marginBottom: '20px',
            color: '#333333',
          }}
        >
          Hi there!
        </p>

        <p
          style={{
            fontSize: '16px',
            marginBottom: '25px',
            color: '#555555',
          }}
        >
          Thank you for taking the time to submit your feature request. I really
          appreciate your feedback and ideas for improving the Job Application
          Tracker.
        </p>

        <div
          style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            padding: '20px',
            margin: '25px 0',
          }}
        >
          <h3
            style={{
              color: '#007bff',
              fontSize: '16px',
              margin: '0 0 10px 0',
              fontWeight: 'bold',
            }}
          >
            Your Request:
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: '#666666',
              margin: '0',
              fontStyle: 'italic',
            }}
          >
            "{featureRequest.description}"
          </p>
        </div>

        <p
          style={{
            fontSize: '16px',
            marginBottom: '20px',
            color: '#555555',
          }}
        >
          I will will review your suggestion and consider it for future updates.
          While I can't implement every request, I carefully evaluate each one
          based on user needs and technical feasibility.
        </p>

        <p
          style={{
            fontSize: '16px',
            marginBottom: '30px',
            color: '#555555',
          }}
        >
          Keep an eye on our updates - you might see your idea come to life!
        </p>

        <div
          style={{
            textAlign: 'center' as const,
            margin: '30px 0',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#007bff',
              color: '#ffffff',
              padding: '12px 25px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Continue Tracking Jobs
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '20px 30px',
          textAlign: 'center' as const,
          borderTop: '1px solid #e9ecef',
        }}
      >
        <p
          style={{
            fontSize: '14px',
            color: '#666666',
            margin: '0',
          }}
        >
          Thanks for helping me build a better job tracking experience!
        </p>
      </div>
    </div>
  );
}
