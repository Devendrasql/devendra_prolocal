# Portfolio Website - Setup Guide

A fully responsive portfolio website with an admin panel for managing projects. Built with Next.js, Prisma, PostgreSQL (Supabase), and modern UI design principles.

## Features

### Public Site
- Responsive homepage with hero section
- Featured and recent projects sections
- Project listing page with filtering
- Detailed project pages with:
  - Project images
  - View counter
  - Tags and metadata
  - Related projects
  - Next/Previous navigation
- SEO optimized with metadata, Open Graph, and JSON-LD
- Mobile-friendly navigation with hamburger menu

### Admin Panel
- Secure JWT-based authentication
- Dashboard with analytics:
  - Total projects, featured projects, and view counts
  - Top performing projects
  - Views over time chart
- Project management:
  - Create, edit, and delete projects
  - Add project images (via URL)
  - Rich content editor
  - Tag management
  - Mark projects as featured
  - Editorial ranking system

### Technical Features
- Server-side rendering for optimal performance
- Robust ranking algorithm based on views and editorial input
- View tracking with IP and user agent logging
- Responsive design with Tailwind-inspired utility classes
- Type-safe with TypeScript
- Database migrations managed
- Automatic sitemap generation

## Admin Access

### Login Credentials
- **URL**: http://localhost:3000/admin/login
- **Email**: admin@example.com
- **Password**: admin123

**IMPORTANT**: Change these credentials in production!

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
The database is already configured and migrated. The schema includes:
- User management with role-based access
- Project storage with tagging
- View tracking and analytics
- Ranking system

### 3. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000 to see your portfolio.

### 4. Build for Production
```bash
npm run build
npm start
```

## Managing Your Portfolio

### Adding Projects

1. Log in to the admin panel at `/admin/login`
2. Navigate to "Projects" in the admin menu
3. Click "New Project"
4. Fill in the form:
   - **Title**: Project name (required)
   - **Summary**: Brief description (required)
   - **Content**: Detailed description (optional, supports markdown)
   - **Image URL**: Link to project image (optional)
   - **Tags**: Comma-separated tags (e.g., "react, nextjs, typescript")
   - **Featured**: Check to display on homepage
5. Click "Create Project"

### Editing Projects

1. Go to the Projects page in admin
2. Click "Edit" next to any project
3. Update fields as needed
4. Adjust **Editorial Rank** to influence project ordering (higher = more prominent)
5. Click "Save Changes"

### Deleting Projects

1. Go to the Projects page in admin
2. Click "Delete" next to the project
3. Confirm deletion

**Note**: This action is permanent and will delete all associated data.

## Project Ranking System

Projects are ranked using a combination of:
- **View count**: Organic popularity metric
- **Editorial rank**: Manual curation (0-100)
- **Featured status**: Featured projects appear first

The algorithm calculates a composite score that balances both metrics.

## Customization

### Update Site Information

Edit these files to customize your portfolio:

1. **Site metadata** (`app/layout.tsx`):
   - Title, description, and Open Graph data
   - Social media handles

2. **Homepage content** (`app/(public)/page.tsx`):
   - Hero text and calls-to-action
   - Section headings

3. **Navigation** (`components/Header.tsx`):
   - Your name/brand
   - Navigation links

4. **Footer** (`components/Footer.tsx`):
   - About text
   - Social media links
   - Contact information

5. **Styling** (`app/globals.css`):
   - Colors, fonts, and theme

### Adding Images

For project images, you can:
- Upload to a service like Cloudinary, Imgur, or AWS S3
- Use stock photo URLs from Pexels or Unsplash
- Host images in the `public` folder and reference them as `/image.jpg`

## Database Schema

### Key Tables

- **Project**: Stores project data (title, summary, content, image, views)
- **Tag**: Project categorization
- **ProjectTag**: Many-to-many relationship
- **ProjectView**: Individual view tracking for analytics
- **ProjectRanking**: Ranking scores and editorial input
- **User**: Admin users
- **Role**: User roles (ADMIN, USER)

## Environment Variables

Required variables in `.env`:
```
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Security Notes

1. **Change default admin password** after first login
2. Keep JWT secrets secure and unique
3. Use strong passwords for production
4. Enable HTTPS in production
5. Review and update security settings regularly

## Deployment

This application can be deployed to:
- Vercel (recommended for Next.js)
- Railway
- AWS
- DigitalOcean

Make sure to:
1. Set all environment variables
2. Run database migrations
3. Update NEXT_PUBLIC_SITE_URL to your domain
4. Configure CORS if needed

## Support

For issues or questions:
1. Check Next.js documentation: https://nextjs.org/docs
2. Review Prisma docs: https://www.prisma.io/docs
3. Consult Supabase guides: https://supabase.com/docs

## License

This project is open source and available for personal and commercial use.
