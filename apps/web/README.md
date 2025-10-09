# Jobble

A comprehensive platform for tracking job applications, interviews, and career progress. Built with Next.js, Prisma, and Clerk authentication.

## Features

### 📋 Application Management

- Track job applications with detailed information
- Monitor application status through the hiring pipeline
- Store job descriptions, URLs, and salary information
- Categorize by remote work policies

### 🏢 Company Management

- Maintain a database of companies you've applied to
- Store company information including size, industry, and location
- Link multiple applications to the same company

### 👥 Contact Management

- Track recruiters, hiring managers, and interviewers
- Store contact information and LinkedIn profiles
- Associate contacts with specific companies and interviews

### 📞 Interview Tracking

- Schedule and track interviews
- Record interview types (phone, technical, behavioral, etc.)
- Store interview feedback and outcomes
- Track interview formats (video, in-person, coding platform)

### 📝 Notes & Documentation

- Add notes to applications, interviews, and contacts
- Categorize notes by type (prep, feedback, follow-up, etc.)
- Maintain a searchable history of your job search

### 📄 Resume Management

- Upload and store resumes for each job application
- Secure file storage using Cloudflare R2
- Download resumes with presigned URLs
- Support for PDF, DOC, and DOCX formats
- Organized storage structure: `user-id/application-id/filename`

### 📊 Analytics & Reporting

- Dashboard with key metrics
- Application status breakdown
- Interview outcome statistics
- Monthly application trends
- Company application distribution

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account for authentication

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd jobble
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/job_tracker"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Cloudflare R2 Configuration (for resume uploads)
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=app-tracker
```

4. Set up the database:

```bash
npx prisma migrate dev
npx prisma generate
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Core Entities

#### User

- Authentication and user profile information
- Links to all user's data

#### Company

- Company information (name, website, industry, size, location)
- Can have multiple applications and contacts

#### Application

- Job application details (title, description, status, applied date)
- Links to company and user
- Can have multiple interviews and notes

#### Contact

- Recruiter, hiring manager, or interviewer information
- Links to company and can be associated with interviews

#### Interview

- Interview details (type, format, scheduled time, outcome)
- Links to application and can have multiple contacts

#### Note

- Flexible note-taking system
- Can be attached to applications, interviews, or users

### Status Tracking

Applications follow this pipeline:

1. **DRAFT** - Application in progress
2. **APPLIED** - Application submitted
3. **UNDER_REVIEW** - Application being reviewed
4. **PHONE_SCREEN** - Phone screen scheduled/completed
5. **TECHNICAL_INTERVIEW** - Technical interview scheduled/completed
6. **ONSITE_INTERVIEW** - Onsite interview scheduled/completed
7. **REFERENCE_CHECK** - References being checked
8. **OFFER** - Job offer received
9. **ACCEPTED** - Offer accepted
10. **REJECTED** - Application rejected
11. **WITHDRAWN** - Application withdrawn
12. **GHOSTED** - No response received

## API Endpoints

### Applications

- `GET /api/applications` - List all applications
- `POST /api/applications` - Create new application
- `GET /api/applications/[id]` - Get specific application
- `PUT /api/applications/[id]` - Update application
- `DELETE /api/applications/[id]` - Delete application

### Companies

- `GET /api/companies` - List all companies
- `POST /api/companies` - Create new company

### Analytics

- `GET /api/analytics?type=overview` - Overview statistics
- `GET /api/analytics?type=applications-by-status` - Status breakdown
- `GET /api/analytics?type=applications-by-month` - Monthly trends
- `GET /api/analytics?type=interview-outcomes` - Interview statistics
- `GET /api/analytics?type=company-stats` - Company distribution

## Usage Guide

### Adding Your First Application

1. **Create a Company** (if not exists):

   - Navigate to "Add Application"
   - Click "Add it here" next to company selection
   - Fill in company details

2. **Add Application**:

   - Fill in job title, company, and applied date
   - Add optional details like salary, location, job URL
   - Set initial status (usually "APPLIED")

3. **Track Progress**:
   - Update status as you progress through the pipeline
   - Add interviews when scheduled
   - Record feedback and outcomes

### Managing Interviews

1. **Schedule Interview**:

   - Select interview type (phone, technical, behavioral, etc.)
   - Choose format (video, in-person, coding platform)
   - Set scheduled time and duration

2. **Add Contacts**:

   - Create contact records for interviewers
   - Link contacts to interviews
   - Store contact information for follow-up

3. **Record Outcomes**:
   - Update interview outcome (passed, failed, pending)
   - Add feedback and notes
   - Track next steps

### Analytics & Insights

The dashboard provides:

- **Overview Cards**: Total applications, active applications, interviews, success rate
- **Recent Applications**: Quick view of latest applications
- **Status Tracking**: Visual representation of application pipeline
- **Trends**: Monthly application patterns

## Future Enhancements

- **Email Integration**: Automatic application tracking from email
- **Calendar Integration**: Sync interviews with calendar
- **Resume Tracking**: Version control for resumes sent
- **Salary Negotiation**: Track offer details and negotiations
- **Networking**: Track networking events and connections
- **Skills Tracking**: Map skills to job requirements
- **Export/Import**: Data portability features
- **Mobile App**: Native mobile application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
