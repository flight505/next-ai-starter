# TODO: Vercel Project Setup

## Environment Variables

When deploying to Vercel, ensure the following environment variables are set:

1. `NOTION_API_KEY` - Your Notion API key (from your Notion integration)
2. `NOTION_BLOG_DATABASE_ID` - The ID of your Notion database for the blog

These should be set for Production, Preview, and Development environments.

## Notion Integration Setup

1. Go to https://www.notion.so/my-integrations to view your integrations
2. Access the specific integration created for this project
3. Go to the Notion database intended for the blog
4. Click the 'Share' button on the database
5. Invite the integration, ensuring it has at least 'Read' permissions 