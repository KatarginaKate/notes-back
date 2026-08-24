import 'dotenv/config';

const frontendOrigin = process.env.FRONTEND_DOMAIN || 'http://localhost:5173';
const apiUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 3000}`;

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Notes API',
    version: '1.0.0',
    description: 'Authentication, user profile, avatar, and notes API.',
  },
  servers: [{ url: apiUrl }],
  tags: [
    { name: 'Auth', description: 'Registration and session management' },
    { name: 'Users', description: 'Current user profile' },
    { name: 'Notes', description: 'Current user notes' },
  ],
  components: {
    securitySchemes: {
      sessionCookie: {
        type: 'apiKey',
        in: 'cookie',
        name: 'sessionId',
        description: 'Session cookie returned by register or login.',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '665c4b7f3f8e2b0012345678' },
          username: { type: 'string', example: 'alex' },
          email: { type: 'string', format: 'email', example: 'alex@example.com' },
          avatar: { type: 'string', format: 'uri' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Note: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'Plan for Monday' },
          content: { type: 'string', example: 'Prepare the presentation.' },
          tag: {
            type: 'string',
            enum: ['Work', 'Personal', 'Meeting', 'Shopping', 'Ideas', 'Travel', 'Finance', 'Health', 'Important', 'Todo'],
            example: 'Work',
          },
          userId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: { message: { type: 'string', example: 'Invalid credentials' } },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a user',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthCredentials' } } },
        },
        responses: {
          201: { description: 'User registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          400: { description: 'Email already in use', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in a user',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthCredentials' } } },
        },
        responses: {
          200: { description: 'User logged in; session cookies are set', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Log out the current session',
        security: [{ sessionCookie: [] }],
        responses: { 204: { description: 'Session logged out' } },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh the current session',
        security: [{ sessionCookie: [] }],
        responses: {
          200: { description: 'Session refreshed', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } },
          401: { description: 'Missing or invalid refresh credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/auth/request-reset-email': {
      post: {
        tags: ['Auth'],
        summary: 'Request a password reset email',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } } } },
        },
        responses: { 200: { description: 'Reset request accepted', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } } },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset a password',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['token', 'password'], properties: { token: { type: 'string' }, password: { type: 'string', minLength: 8 } } } } },
        },
        responses: {
          200: { description: 'Password reset', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } },
          401: { description: 'Invalid or expired token', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Get the current user',
        security: [{ sessionCookie: [] }],
        responses: { 200: { description: 'Current user', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }, 401: { description: 'Unauthorized' } },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update the current user profile',
        security: [{ sessionCookie: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { username: { type: 'string' }, email: { type: 'string', format: 'email' } } } } },
        },
        responses: { 200: { description: 'Updated user', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }, 401: { description: 'Unauthorized' } },
      },
    },
    '/users/me/avatar': {
      patch: {
        tags: ['Users'],
        summary: 'Update the current user avatar',
        security: [{ sessionCookie: [] }],
        requestBody: {
          required: true,
          content: { 'multipart/form-data': { schema: { type: 'object', required: ['avatar'], properties: { avatar: { type: 'string', format: 'binary' } } } } },
        },
        responses: {
          200: { description: 'Avatar updated', content: { 'application/json': { schema: { type: 'object', properties: { url: { type: 'string', format: 'uri' }, avatar: { type: 'string', format: 'uri' } } } } } },
          400: { description: 'No file or invalid file type' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/notes': {
      get: {
        tags: ['Notes'],
        summary: 'List current user notes',
        security: [{ sessionCookie: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
          { name: 'perPage', in: 'query', schema: { type: 'integer', minimum: 5, maximum: 20, default: 10 } },
          { name: 'tag', in: 'query', schema: { type: 'string', enum: ['Work', 'Personal', 'Meeting', 'Shopping', 'Ideas', 'Travel', 'Finance', 'Health', 'Important', 'Todo'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Paginated notes',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer' },
                    perPage: { type: 'integer' },
                    totalNotes: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    notes: { type: 'array', items: { $ref: '#/components/schemas/Note' } },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Notes'],
        summary: 'Create a note',
        security: [{ sessionCookie: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['title'], properties: { title: { type: 'string', minLength: 1 }, content: { type: 'string' }, tag: { type: 'string', enum: ['Work', 'Personal', 'Meeting', 'Shopping', 'Ideas', 'Travel', 'Finance', 'Health', 'Important', 'Todo'] } } } } } },
        responses: { 201: { description: 'Note created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } } }, 401: { description: 'Unauthorized' } },
      },
    },
    '/notes/{noteId}': {
      parameters: [{ name: 'noteId', in: 'path', required: true, schema: { type: 'string' } }],
      get: { tags: ['Notes'], summary: 'Get a note', security: [{ sessionCookie: [] }], responses: { 200: { description: 'Note', content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } } }, 404: { description: 'Note not found' } } },
      patch: { tags: ['Notes'], summary: 'Update a note', security: [{ sessionCookie: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', minProperties: 1, properties: { title: { type: 'string', minLength: 1 }, content: { type: 'string' }, tag: { type: 'string', enum: ['Work', 'Personal', 'Meeting', 'Shopping', 'Ideas', 'Travel', 'Finance', 'Health', 'Important', 'Todo'] } } } } } }, responses: { 200: { description: 'Updated note', content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } } }, 404: { description: 'Note not found' } } },
      delete: { tags: ['Notes'], summary: 'Delete a note', security: [{ sessionCookie: [] }], responses: { 200: { description: 'Deleted note', content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } } }, 404: { description: 'Note not found' } } },
    },
  },
};

swaggerSpec.components.schemas.AuthCredentials = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email', example: 'alex@example.com' },
    password: { type: 'string', minLength: 8, example: 'password123' },
  },
};

swaggerSpec.components.schemas.Message = {
  type: 'object',
  properties: { message: { type: 'string' } },
};

swaggerSpec.externalDocs = {
  description: `Frontend origin: ${frontendOrigin}`,
  url: frontendOrigin,
};
